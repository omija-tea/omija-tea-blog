---
base: "[[IMG-20260321214755797.base]]"
태그: []
날짜: 2025-02-13
---
## ./gradlew clean 실패 문제
```dart
./gradlew clean

Welcome to Gradle 8.6!

Here are the highlights of this release:
 - Configurable encryption key for configuration cache
 - Build init improvements
 - Build authoring improvements

For more details see https://docs.gradle.org/8.6/release-notes.html

Starting a Gradle Daemon, 1 incompatible Daemon could not be reused, use --status for details
> Task :gradle:compileGroovy FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':gradle:compileGroovy'.
> BUG! exception in phase 'semantic analysis' in source unit '/Users/namjunjeong/flutter/packages/flutter_tools/gradle/src/main/groovy/app_plugin_loader.groovy' Unsupported class file major version 66

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

BUILD FAILED in 10s
1 actionable task: 1 executed
```
java 버전 문제임.
### gradle-wrapper-properties
```dart
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.6-all.zip
```
그래들 버전이 8.6인데, 내 mac의 openjdk는 22. 17로 다운그레이드해준다
```dart
brew install openjdk@17
echo export ~~
export flag~~
```
이후 다시 ./gradlew clean 수행
## firebase 연동 문제
```dart
* What went wrong:
Plugin [id: 'com.google.gms.google-services'] was not found in any of the following sources:

- Gradle Core Plugins (plugin is not in 'org.gradle' namespace)
- Plugin Repositories (plugin dependency must include a version number for this source)

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.
```

최신 gradle 구조에서는 root의 build.gradle 대신 android/settings.gradle과 app수준 gradle에서 플러그인 및 의존성을 관리함
### app/build.gradle
```dart
apply plugin: 'com.google.gms.google-services'
```
맨 아래에 위 구문 추가
### settings.gradle
```dart
plugins {
...
    id 'com.google.gms.google-services' version '4.4.2' apply false
...
```