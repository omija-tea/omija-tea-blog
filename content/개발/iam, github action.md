---
title: "github actions"
date: 2024-06-14 20:05
tags:
  - topic/aws
  - topic/cicd
  - type/note
publish: true
---
iam을 이용하여 여러 명의 admin 계정을 만들었음. 루트 계정 쓰다가 비밀번호 실수로 틀리면 example.com으로 인증코드 날아가는거 그거 일일이 관리해줄순 없으니까…

# github actions
깃허브 태그를 이용해서 ECR에 푸쉬하고 싶다는 생각이 들었다. `git tag v0.0.10` 이런 식으로 해서 태그를 달고 github action에서 인식하게 해보자
```yaml
name: my-server-github-actions

on:
  push:
    tags:
      - 'v*.*.*'


jobs:
  build:
    name: Deploy to ECR
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ECR_ACCESS_KEY }}
        aws-secret-access-key: ${{ secrets.AWS_ECR_SECRET_ACCESS_KEY}}
        aws-region: ${{ secrets.AWS_ECR_REGION }}

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Extract version from github tag
      id: extract_version
      run: |
        echo "Tag name : $GITHUB_REF_NAME"
        echo "VERSION=$GITHUB_REF_NAME" >> $GITHUB_ENV

    - name: Build, tag, and push image to Amazon ECR
      id: build-image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: ${{ secrets.AWS_ECR_REPOSITORY_NAME }}
        IMAGE_TAG: ${{ env.VERSION }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        echo "build image complete : $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        echo "push image complete : $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
    - name: Set output of completed image uri
      id: set-output
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: ${{ secrets.AWS_ECR_REPOSITORY_NAME }}
        IMAGE_TAG: ${{ env.VERSION }}
      run: echo "IMAGE_URI=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

```
일단 첫번째로 이렇게 작성해 봤음. github tag를 이용해서 버저닝을 하고 싶었다.
`git tag v0.0.~` 를 하고 `git push origin —tags` 를 사용해서 태그를 알려줬음
![[IMG-20260321223057530.png]]
태그를 아주 잘 잡는 모습
![[IMG-20260321223057600.png]]
앗차차… config는 gitignore대상이라 서버에 안 올라가 있다. 그걸 생각을 못했네
[https://ji5485.github.io/post/2021-06-26/create-env-with-github-actions-secrets/](https://ji5485.github.io/post/2021-06-26/create-env-with-github-actions-secrets/) 여기를 참고했다
`git push origin :v0.0.13` 이걸로 원격 저장소 태그 삭제 가능 `git tag -d v0.0.13` 이걸로 로컬 태그 삭제 가능
```yaml
    - name: Make .env from secret
      id: make-envfile
      run: |
        touch /config/.env
        echo "${{ secrets.ENV_A_KEY }}=${{ secrets.ENV_A_VALUE }}" >> /config/.env
        echo "${{ secrets.ENV_B_KEY }}=${{ secrets.ENV_B_VALUE }}" >> /config/.env
        echo "${{ secrets.ENV_C_KEY }}=${{ secrets.ENV_C_VALUE }}" >> /config/.env
        echo /config/.env

```
요 스탭을 추가했음. env의 key도 숨기고 싶어서 위 방식처럼 했음.
# iam role to EC2
ECR에서 이미지를 땡겨올 수 있는 iam role을 하나 만들었음
그전에 도커 먼저 설치하자
```yaml
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -aG docker ec2-user
```
```python
aws ec2 associate-iam-instance-profile --instance-id {instance-id} --iam-instance-profile Name={iamrole-name}
```
이걸로 ec2 인스턴스에 iam role을 갖다 붙임
```python
aws ec2 describe-iam-instance-profile-associations
```
이걸로 정책 붙은거 확인
이제 EC2 들어가서
```python
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com
```
하면 docker를 ECR에 인증할 수 있다. IAM Role 없으면 aws configure로 직접 로그인 해야됨
# https
근데 여기서 막혔다… 하 어떢해야되지
ALB를 쓰면 될거 같긴 한데 돈이 아깝고 public하나에 붙이는건데 너무 오반거 같기도 하고
—> 그렇게 하려면 [https://blog.naver.com/sssang97/222913082357](https://blog.naver.com/sssang97/222913082357) 여기 참고하면 될거같긴 하다
나는 traefik을  써보기로 함
