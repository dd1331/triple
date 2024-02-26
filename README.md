# 특이사항

### FileService

- fileService 인터페이스를 활용하여 postService에 구현체 주입
- localFileService는 로컬에 파일저장하는 역할을 하며 추후 AWS S3 등의 외부 서비스 활용시 해당 구현체를 Postmoudle의 provider에 갈아끼워 간단하게 구현체를 변경할 수 있고 fileService의 upload 메소드에만 의존하기 때문에 postService는 변경에 영향을 받지 않는다.

### PostRepository

- postRespository 인터페이스를 활용하여 postService에 구현체 주입
- typePostRepository 구현체를 주입하여 사용중이며 추구 orm을 다른 것으로 변경시 postRespository 인터페이스를 따르는 구현체를 새로 생성하여 주입시 postService는 변경에 영향을 받지 않는다

### GoodBaseEntity

- Date관련 컬럼과 생성자로 객체생성 기능을 상속을 통해 중복구현 방지

### GoodBaseDto

- 생성자로 객체생성 기능을 상속하여 간단하게 응답객체 생성

### 테스트코드

- 성공/실패케이스에 대한 e2e 테스트와 간단한 dto 유닛테스트

### ExceptionFilter

- AOP 관점에서 모든에러를 한곳에서 처리할 수 있도록 하고 httpException과 기타 예외를 구분하여 다른 처리(웹훅전송 등)를 할 수 있도록 분리

### swagger plugin https://docs.nestjs.com/openapi/cli-plugin

- 스웨거 플러그인을 추가하여 .dto 파일 전체에 자동으로 프로퍼티 설정되게함. 필요시 커스텀 가능
