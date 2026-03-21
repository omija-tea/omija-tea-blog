---
title: "자바 static과 클래스 로딩 관련 코드 분석"
date: 2026-01-22 21:18
tags: []
publish: false
---
```java
public class Test {
    
    public static Test lst = new Test();
    public static int SIZE = 10;
    public int[] array = null;
    
    public static Test getInstance() {
        return lst;
    }
    
    private Test() {
        this.array = new int[SIZE];
    }
    public static void main(String[] args) {
        // TODO Auto-generated method stub
        Test lst = Test.getInstance();
        System.out.println(lst.array.length);
    }

}
```
이 코드의 출력값은 0임. 즉 this.array 는 int[0]임!!
```java
    public static Test lst = new Test();
    public static int SIZE = 10;
```
이거 두개 위치를 바꾸면 결과가 10임!! 왜?

JVM이 `test` 클래스를 실행할 때, 일단 클래스 파일을 읽어서 메모리에 올림. 이때 static field의 초기화가 진행되는데, 코드가 작성된 순서 그대로 위에서 아래로 실행이 됨.
1. JVM method 영역에 Test 클래스 정보가 기록됨. 이때 static 변수는 메모리가 할당되고 기본값 (int는 0, array는 null등등..)으로 초기화됨
2. 이제 명시적 값들이 할당되기 시작함. 근데??? 맨 위에 있는 애가 `public static Test lst = new Test();` 임!! 
3. new Test()를 위해 heap 메모리를 비움
4. array = null;(명시적 초기화) 이 실행됨 (사실상 null 기본값을 다시 null로 덮어쓰는것)
5. Test() 생성자로 진입
6. this.array = new int[SIZE]를 만나게 되는데, 어라? static int SIZE = 10에 값이 들어가기 전이라서 SIZE는 기본값인 0임!
7. 샤갈! array에는 길이가 0인 배열의 주소값이 할당되어버림
8. 그 다음에야 SIZE 변수에 10이 업데이트됨…



