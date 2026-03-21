---
title: "manually build-push github action"
date: 2024-06-11 15:45
tags: []
publish: false
---
코드를 docker image로 만들고 ecr에 푸쉬한 뒤 서버에서 땡겨서 배포하는 github action을 만들자. github 사이트에서 직접 클릭해서 작동하도록 먼저 만들어보자.

먼저 비밀로 관리해야하는 친구들은 github 환경변수에 박아놓고 시작.
workflow_dispatch를 이용하면 직접 손으로 작동시키게 만들 수 있다. 버전 태그로 관리하도록 하자.
outputs로 변수를 할당해놓고 set_output에서 변수에 값을 할당시켜주면 다른 job에서도 needs를 통해 가져다 쓸 수 있음.
```yaml
      env:
        IMAGE_VERSION: ${{ github.event.inputs.tag }}
      run: |
        echo "IMAGE_VERSION=$IMAGE_VERSION" >> $GITHUB_OUTPUT
```
요래요래 하면 됨
```yaml
name: build_manual_arm

on:
  release:
    types: [created]
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag name'
        required: true
        default: 'v*.*.*'

jobs:
  build:
    name: Deploy to ECR
    runs-on: ubuntu-latest
    outputs:
      image_version: ${{ steps.set_output.outputs.IMAGE_VERSION }}
    steps:
    - name: Checkout
      id: checkout_code
      uses: actions/checkout@v3

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ECR_ACCESS_KEY }}
        aws-secret-access-key: ${{ secrets.AWS_ECR_SECRET_ACCESS_KEY}}
        aws-region: ${{ secrets.AWS_ECR_REGION }}

    - name: Login to Amazon ECR
      id: login_ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Extract version from github tag
      id: extract_version
      run: |
        echo "Tag name : $GITHUB_REF_NAME"
        echo "VERSION=$GITHUB_REF_NAME" >> $GITHUB_ENV

    - name: Build, tag, and push image to Amazon ECR
      id: build_image
      env:
        ECR_REGISTRY: ${{ steps.login_ecr.outputs.registry }}
        ECR_REPOSITORY: ${{ secrets.AWS_ECR_REPOSITORY_NAME }}
        IMAGE_TAG: ${{ github.event.inputs.tag }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        echo "build image complete : $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        echo "push image complete : $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"

    - name: Set output of completed image uri
      id: set_output
      env:
        IMAGE_VERSION: ${{ github.event.inputs.tag }}
      run: |
        echo "IMAGE_VERSION=$IMAGE_VERSION" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        id: checkout_code
        uses: actions/checkout@v3

      - name: SCP to EC2
        id: scp_to_ec2
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_KEY }}
          source: "./docker-compose.yml, ./nginx"
          target: /home/ec2-user

      - name: SSH to EC2
        id: ssh_to_ec2
        uses: appleboy/ssh-action@master
        env:
          AWS_ECR_REGISTRY_NAME: ${{ secrets.AWS_ECR_REGISTRY_NAME }}
          AWS_ECR_REPOSITORY_NAME: ${{ secrets.AWS_ECR_REPOSITORY_NAME}}
          AWS_ECR_REGION: ${{ secrets.AWS_ECR_REGION }}
          VERSION: ${{ needs.build.outputs.image_version }}
          CERT: ${{ secrets.CERT}}
          KEY: ${{ secrets.CERT_KEY}}
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_KEY }}
          envs: AWS_ECR_REGISTRY_NAME, AWS_ECR_REPOSITORY_NAME, AWS_ECR_REGION, VERSION, CERT, KEY
          script: |
            aws ecr get-login-password --region $AWS_ECR_REGION | docker login --username AWS --password-stdin $AWS_ECR_REGISTRY_NAME
            cd /home/ec2-user
            export AWS_ECR_BACKEND_IMAGE_URI=$AWS_ECR_REGISTRY_NAME/$AWS_ECR_REPOSITORY_NAME:$VERSION
            printf -- "$CERT" > /home/ec2-user/nginx/cert.pem
            printf -- "$KEY" > /home/ec2-user/nginx/key.pem
            docker-compose pull
            docker-compose up -d


```
빌드하는데 한 3분정도가 걸린다. 딴거 하다 와도 되도록 + 프론트 친구들에게 build 관련 알람이 가도록 slack 알람을 설정해보자.
github action은 성공/실패에 따라 조건문을 걸 수 있음을 이용한다.
slack에서 웹훅을 만들고 해당 웹훅으로 요청을 보내기만 하면 되기 때문에 github action marketplace에서 적당히 잘 작동하는 http request workflow를 하나 가져다 썼음
```python
    - name: Send Start Notification
      id: send_start_notification_via_slack
      uses: tyrrrz/action-http-request@master
      with:
        url: ${{ secrets.WEBHOOK_SLACK_NOTIFICATION }}
        method: POST
        headers: |
          Content-Type: application/json
        body: |
          {
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Build and Deploy of a new release is in progress* :building_construction:"
                }
              },
              {
                "type" : "divider"
              },
              {
                "type": "section",
                "fields": [
                  {
                    "type": "mrkdwn",
                    "text": "*Repository:*\n${{ secrets.AWS_ECR_REPOSITORY_NAME}}"
                  },
                  {
                    "type": "mrkdwn",
                    "text": "*Release Version:*\n${{ github.event.inputs.tag }}"
                  }
                ]
              }
            ]
          }
```