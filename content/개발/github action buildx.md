---
title: "github action buildx"
date: 2024-06-12 10:10
tags:
  - topic/docker
  - topic/cicd
  - topic/aws
  - type/note
publish: false
---
t4g.small이 이번 2024년동안 무료라길래 한번 써보기로 했다.
다만 아키텍쳐가 github-action 기본 architecture인 x86이 아닌 arm이다.
두가지 방법 중 선택해야한다.
1. github action에서 arm의 custom runner 만들기
2. buildx로 arm에서도 호환되는 이미지 만들기

난 두번째 방법을 사용하기로 함
```yaml
name: build_manual_buildx

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

    - name: Make .env from secret
      id: make_envfile
      run: |
        touch ./config/.env
        echo "${{ secrets.ENV_A_KEY }}=${{ secrets.ENV_A_VALUE }}" >> ./config/.env
        echo "${{ secrets.ENV_B_KEY }}=${{ secrets.ENV_B_VALUE }}" >> ./config/.env
        echo "${{ secrets.ENV_C_KEY }}=${{ secrets.ENV_C_VALUE }}" >> ./config/.env
        echo "${{ secrets.ENV_D_KEY }}=${{ secrets.ENV_D_VALUE }}" >> ./config/.env
        echo "${{ secrets.ENV_E_KEY }}=${{ secrets.ENV_E_VALUE }}" >> ./config/.env
        echo "${{ secrets.ENV_F_KEY }}=${{ secrets.ENV_F_VALUE }}" >> ./config/.env
        echo "${{ secrets.ENV_G_KEY }}=${{ secrets.ENV_G_VALUE }}" >> ./config/.env
        echo "WEBHOOK_SLACK_USER_APPLY=${{ secrets.WEBHOOK_SLACK_USER_APPLY }}" >> ./config/.env
        echo /config/.env

    - name: Setup Docker QEMU
      id: setup_qemu_action
      uses: docker/setup-qemu-action@v3

    - name: Setup Docker Buildx
      id: setup_buildx_action
      uses: docker/setup-buildx-action@v3

    - name: Build, tag, and push image to Amazon ECR
      id: build_image
      env:
        ECR_REGISTRY: ${{ steps.login_ecr.outputs.registry }}
        ECR_REPOSITORY: ${{ secrets.AWS_ECR_REPOSITORY_NAME }}
        IMAGE_TAG: ${{ github.event.inputs.tag }}
      run: |
        docker buildx build --push --platform linux/amd64,linux/arm64/v8 -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        echo "build and push image complete : $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"

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
요래하면 다중 플랫폼 이미지를 만들어서 ecr에 푸시할 수 있다.
환경변수들은 github action secret에 넣어놓고 ec2에서 prinf를 통해 env로 만들어줬음. 별로 좋은 방법은 아니다. 나아아아아아아중에 k8s를 쓴다면 secret으로 하면 될듯. 지금은 명쾌한 방법이 안떠올라서 그냥 저렇게 해두었다.