---
title: "원드라이브 이름 변경-AWS CLI 자격증명"
date: 2024-04-16
tags: []
publish: false
---
원드라이브 한글로 나오는 문제 해결 방법 :
실행 → regedit → 
컴퓨터\HKEY_CURRENT_USER\Software\Microsoft\OneDrive\Accounts\Business?
들어가서 displayname 더블클릭 후 변경. 이후 재부팅

[aws CLI 자격 증명하기](https://kimjingo.tistory.com/209)
aws configure 하고 키 입력하면 완료
