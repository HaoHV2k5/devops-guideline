export interface WeekTopic {
  id: number;
  weekNumber: number;
  phaseId: number;
  phaseName: string;
  title: string;
  tagline: string;
  duration: string;
  stickyColor: "yellow" | "teal" | "coral" | "rose" | "blue" | "orange";
  skills: string[];
  javaSpecificFocus: string;
  coreConcepts: string[];
  breakAndDebug: {
    title: string;
    scenario: string;
    howToBreak: string;
    howToDebug: string[];
    rootCauseExplained: string;
    fixSolution: string;
  };
  whyQuestions: {
    question: string;
    answer: string;
    keyPoints: string[];
  }[];
  cheatSheet: {
    command: string;
    description: string;
  }[];
  labAndDocs: {
    name: string;
    url: string;
    type: "lab" | "doc" | "book";
  }[];
}

export interface Phase {
  id: number;
  title: string;
  badge: string;
  weeks: string;
  description: string;
  color: string;
  accentBg: string;
}

export const PHASES: Phase[] = [
  {
    id: 1,
    title: "Nền tảng Hệ thống & Mạng",
    badge: "Foundation",
    weeks: "Tuần 1 - 2",
    description: "Làm chủ Linux internals, Systemd, Process, Memory và Mạng máy tính dưới góc nhìn kỹ sư Java Backend.",
    color: "#4262ff",
    accentBg: "bg-blue-50 border-blue-200 text-blue-800"
  },
  {
    id: 2,
    title: "Containerization & CI/CD",
    badge: "Automation",
    weeks: "Tuần 3 - 5",
    description: "Đóng gói tối ưu Spring Boot bằng Multi-stage Dockerfile, Docker Compose và xây dựng CI/CD pipeline tự động hóa với GitHub Actions.",
    color: "#0fbcb0",
    accentBg: "bg-teal-50 border-teal-200 text-teal-800"
  },
  {
    id: 3,
    title: "Cloud & Kubernetes Orchestration",
    badge: "Orchestration",
    weeks: "Tuần 6 - 9",
    description: "Khởi tạo hạ tầng AWS với Terraform, chuyển dịch toàn bộ ứng dụng lên K8s, quản lý Helm charts và triển khai GitOps với ArgoCD.",
    color: "#fcb900",
    accentBg: "bg-amber-50 border-amber-200 text-amber-900"
  },
  {
    id: 4,
    title: "Observability, Security & Capstone",
    badge: "Production Ready",
    weeks: "Tuần 10 - 12",
    description: "Giám sát hệ thống với Prometheus/Grafana/Loki, DevSecOps, thực hiện Chaos Engineering, Zero-downtime Blue/Green và diễn tập phỏng vấn.",
    color: "#ff9999",
    accentBg: "bg-rose-50 border-rose-200 text-rose-900"
  }
];

export const ROADMAP_WEEKS: WeekTopic[] = [
  {
    id: 1,
    weekNumber: 1,
    phaseId: 1,
    phaseName: "Nền tảng Hệ thống & Mạng",
    title: "Linux System Deep-Dive & Quản lý Process JVM",
    tagline: "Từ sử dụng lệnh cơ bản sang thấu hiểu cựu thể Kernel, Systemd, Memory & Thread của Java",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "yellow",
    skills: ["Linux FHS", "Systemd Units", "Process Management", "JVM Profiling", "htop", "jstack"],
    javaSpecificFocus: "Phân tích Thread Dump & Memory Usage của Java JVM bằng lệnh Linux nguyên bản mà không cần GUI.",
    coreConcepts: [
      "Linux File System Hierarchy (FHS) & File Permissions (chmod, chown, SUID, SGID)",
      "Systemd Architecture: Tạo custom `.service` file để auto-restart Spring Boot JAR khi server reboot",
      "Process Lifecycle, Signals (SIGTERM vs SIGKILL, xử lý Graceful Shutdown trong Java)",
      "Bộ nhớ Linux: Phân biệt `free`, `available`, `buff/cache` và hiện tượng Linux OOM Killer",
      "JVM CLI tools trên server Linux: `jps`, `jstat -gc`, `jcmd`, `jstack`, `jmap`"
    ],
    breakAndDebug: {
      title: "Chẩn đoán CPU Spike 100% của một Thread Java",
      scenario: "Ứng dụng Spring Boot đột ngột đẩy 1 CPU core lên 100% liên tục. Cần xác định chính xác dòng code nào đang chạy infinite loop mà không restart server.",
      howToBreak: "Viết 1 background thread trong Spring Boot chứa `while(true) { double x = Math.random() * Math.random(); }` và kích hoạt qua API.",
      howToDebug: [
        "1. Dùng `top -H -p <PID>` để liệt kê danh sách thread con của JVM đang ăn nhiều CPU nhất.",
        "2. Ghi lại Thread ID (TID) ở cột PID (ví dụ TID = 4521).",
        "3. Chuyển đổi TID sang hệ Hex: `printf '%x\n' 4521` (kết quả: 0x11a9).",
        "4. Xuất Thread Dump: `jstack <PID> > /tmp/thread.dump`.",
        "5. Tìm kiếm nid hex trong dump: `grep -A 25 'nid=0x11a9' /tmp/thread.dump`."
      ],
      rootCauseExplained: "Mỗi Thread trong JVM (HotSpot) tương ứng trực tiếp với 1 native OS Light Weight Process (LWP) trên Linux Kernel. Lệnh `top -H` cho phép soi native thread, và `jstack` ánh xạ nó qua thuộc tính `nid` (native ID).",
      fixSolution: "Dùng `grep` để định vị đúng method và line number gây treo CPU, sửa code thêm điều kiện dừng hoặc back-off sleep."
    },
    whyQuestions: [
      {
        question: "Tại sao lệnh `free -m` trên Linux thường hiển thị Free Memory rất thấp (chỉ vài trăm MB) nhưng server vẫn chạy hoàn toàn bình thường?",
        answer: "Linux Kernel tối ưu RAM bằng cách tận dụng phần RAM rảnh để làm Page Cache & Buffers nhằm tăng tốc đọc/ghi đĩa. Khi ứng dụng cần thêm RAM, Kernel sẽ tự động giải phóng vùng cache này ngay lập tức. Cần nhìn vào cột `available` thay vì `free`.",
        keyPoints: ["Page Cache & Buffers", "Free vs Available", "Kernel reclaiming memory"]
      },
      {
        question: "Tại sao chạy backend production bằng `nohup java -jar app.jar &` bị coi là anti-pattern so với Systemd Service?",
        answer: "`nohup` không tự động khởi động lại khi crash, không restart sau reboot server, không quản lý cgroups/giới hạn tài nguyên, khó phân phối signal SIGTERM để Graceful Shutdown và log bị dồn vào `nohup.out` không xoay vòng (logrotate). Systemd cung cấp `Restart=on-failure`, gom log qua `journalctl` và sandboxing bảo mật.",
        keyPoints: ["Auto-restart on crash", "Log management qua Journalctl", "Graceful shutdown signal", "Resource limits"]
      }
    ],
    cheatSheet: [
      { command: "top -H -p $(pgrep -f java)", description: "Xem các thread con của JVM tiêu hao CPU/RAM" },
      { command: "journalctl -u springboot-app.service -f -n 100", description: "Xem live log của service quản lý bằng systemd" },
      { command: "systemctl enable --now springboot-app", description: "Bật service và kích hoạt tự khởi động cùng OS" },
      { command: "lsof -i :8080", description: "Kiểm tra process nào đang chiếm port 8080" },
      { command: "jcmd $(pgrep -f java) VM.flags", description: "Xem toàn bộ JVM flags đang áp dụng ở runtime" }
    ],
    labAndDocs: [
      { name: "Linux Survival Interactive Lab", url: "https://linuxsurvival.com/", type: "lab" },
      { name: "Systemd Service Official Docs", url: "https://systemd.io/", type: "doc" },
      { name: "The Linux Command Line (William Shotts)", url: "https://linuxcommand.org/tlcl.php", type: "book" }
    ]
  },
  {
    id: 2,
    weekNumber: 2,
    phaseId: 1,
    phaseName: "Nền tảng Hệ thống & Mạng",
    title: "Mạng máy tính & Reverse Proxy Nginx cho Backend",
    tagline: "Làm chủ bắt gói tin, Socket states, TLS Handshake và Nginx Reverse Proxy trước Tomcat",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "teal",
    skills: ["TCP Handshake", "TIME_WAIT/CLOSE_WAIT", "DNS Resolution", "Nginx Config", "SSL/TLS", "Certbot"],
    javaSpecificFocus: "Cấu hình Forwarded Headers (`X-Forwarded-For`, `X-Forwarded-Proto`) để Spring Security và Servlet nhận đúng IP và giao thức thực của client.",
    coreConcepts: [
      "TCP 3-way Handshake & 4-way Teardown: Thấu hiểu trạng thái TIME_WAIT và rò rỉ socket CLOSE_WAIT",
      "DNS Resolution: Phân tích flow `/etc/hosts` → `/etc/resolv.conf` → DNS Cache → Recursive Resolver",
      "HTTP/1.1 Keep-Alive, HTTP/2 Multiplexing & HTTP/3 QUIC",
      "SSL/TLS Handshake: Certificate Authority, SNI, TLS Termination, tự động cấp chứng chỉ Let's Encrypt với Certbot",
      "Nginx Architecture: Worker processes, non-blocking event-driven loop, Reverse Proxy, Upstream Load Balancing"
    ],
    breakAndDebug: {
      title: "Xử lý lỗi 504 Gateway Timeout và rò rỉ kết nối CLOSE_WAIT",
      scenario: "Khách hàng than phiền API xuất hiện mã lỗi `504 Gateway Timeout` khi tải báo cáo nặng. Đồng thời Nginx báo lỗi `no live upstreams while connecting to upstream`.",
      howToBreak: "Tạo 1 endpoint Spring Boot với `Thread.sleep(70000)` trong khi cấu hình Nginx mặc định `proxy_read_timeout 60s;`.",
      howToDebug: [
        "1. Kiểm tra log Nginx: `tail -f /var/log/nginx/error.log` (phát hiện `upstream timed out (110: Connection timed out)`).",
        "2. Kiểm tra trạng thái socket: `ss -tan | grep ':8080'` để đếm số socket ở trạng thái `ESTAB`, `TIME_WAIT` và `CLOSE_WAIT`.",
        "3. Dùng `curl -Iv -k --resolve api.domain.com:443:127.0.0.1 https://api.domain.com/slow-endpoint` để xem trực tiếp headers trả về."
      ],
      rootCauseExplained: "Nginx chờ Tomcat phản hồi quá thời gian quy định trong `proxy_read_timeout`. Nginx chủ động đóng kết nối với client và trả về 504, nhưng Tomcat vẫn tiếp tục xử lý gây lãng phí tài nguyên.",
      fixSolution: "Tăng timeout có kiểm soát trên Nginx (`proxy_read_timeout 120s;`) kết hợp chuyển các tác vụ nặng sang Async Processing (Spring `@Async` hoặc Message Queue)."
    },
    whyQuestions: [
      {
        question: "Tại sao luôn đặt Nginx đứng trước Embedded Tomcat của Spring Boot thay vì mở thẳng port 8080 ra ngoài Internet?",
        answer: "1. TLS Termination: Offload giải mã HTTPS cho Nginx tối ưu C, giúp JVM tập trung xử lý business logic. 2. Buffer Request/Response: Bảo vệ Tomcat khỏi tấn công Slowloris (slow clients chiếm thread pool). 3. Tĩnh điện: Phục vụ static files cực nhanh. 4. Bảo mật: Ẩn thông tin runtime header và giới hạn Rate Limiting.",
        keyPoints: ["TLS Termination offload", "Slowloris attack protection", "Rate limiting & IP Whitelist", "Static asset caching"]
      },
      {
        question: "Tại sao socket bị kẹt ở trạng thái `CLOSE_WAIT` là do lỗi của code Java backend chứ không phải lỗi của Nginx?",
        answer: "Trong quy trình đóng kết nối TCP 4 bước, khi client gửi FIN, server nhận FIN và trả ACK thì socket phía server rơi vào `CLOSE_WAIT`. Server chỉ thoát khỏi trạng thái này khi code ứng dụng chủ động gọi method `.close()` trên socket/connection. Nếu kẹt `CLOSE_WAIT`, nghĩa là code Java đã quên giải phóng kết nối.",
        keyPoints: ["TCP 4-way teardown", "CLOSE_WAIT thuộc về receiver của FIN", "Rò rỉ connection pool hoặc socket unclosed"]
      }
    ],
    cheatSheet: [
      { command: "nginx -t && nginx -s reload", description: "Kiểm tra cú pháp cấu hình và reload Nginx không downtime" },
      { command: "ss -s", description: "Xem tổng quan số lượng socket (TCP, UDP, TIME-WAIT, ESTAB)" },
      { command: "dig +trace api.example.com", description: "Trace đường đi phân giải DNS từ Root Server xuống Authoritative" },
      { command: "openssl s_client -connect api.example.com:443 -servername api.example.com", description: "Kiểm tra chứng chỉ SSL/TLS và ngày hết hạn" },
      { command: "certbot --nginx -d api.example.com", description: "Tự động xin và cài đặt chứng chỉ Let's Encrypt cho Nginx" }
    ],
    labAndDocs: [
      { name: "Nginx Official Documentation", url: "https://nginx.org/en/docs/", type: "doc" },
      { name: "Cloudflare Learning Center (Networking)", url: "https://www.cloudflare.com/learning/", type: "doc" },
      { name: "High Performance Browser Networking (Ilya Grigorik)", url: "https://hpbn.co/", type: "book" }
    ]
  },
  {
    id: 3,
    weekNumber: 3,
    phaseId: 2,
    phaseName: "Containerization & CI/CD",
    title: "Docker & Containerization chuẩn Production cho Java",
    tagline: "Đóng gói tối ưu Spring Boot bằng Multi-stage build, JRE Distroless và JVM Container Awareness",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "coral",
    skills: ["Docker Internals", "Namespaces & cgroups", "Multi-stage Build", "Eclipse Temurin JRE", "JVM cgroups v2", "Non-root User"],
    javaSpecificFocus: "Cấu hình `-XX:MaxRAMPercentage` và Container Awareness để JVM không bị Linux cgroup OOM Killer bắn hạ bất ngờ.",
    coreConcepts: [
      "Bản chất Container: Linux Namespaces (PID, NET, MNT) và Control Groups (cgroups v1 vs v2 limit CPU/RAM)",
      "Docker Image Layering, Copy-on-Write (OverlayFS) và tối ưu hóa Build Cache",
      "Multi-stage Dockerfile: Tách biệt build stage (Maven/Gradle + JDK) và runtime stage (JRE Minimal / Distroless)",
      "JVM Memory trong container: Heap, Metaspace, Native Threads và cgroups limit",
      "Bảo mật Container: Chạy với Non-root user (`USER spring:spring`), loại bỏ shell và curl trong production image"
    ],
    breakAndDebug: {
      title: "Hiện tượng JVM bị OOM Killer (Exit 137) dù chưa hề đạt Java OutOfMemoryError",
      scenario: "Container Spring Boot đột ngột bị tắt với Exit Code 137 trên server. Log của ứng dụng không có bất kỳ dòng exception `java.lang.OutOfMemoryError` nào.",
      howToBreak: "Chạy container với giới hạn `--memory=512m` nhưng cấu hình JVM `-Xmx512m` hoặc không set MaxRAMPercentage trên JDK cũ.",
      howToDebug: [
        "1. Chạy `docker inspect <container_id> --format '{{.State.OOMKilled}} {{.State.ExitCode}}'` (trả về `true 137`).",
        "2. Kiểm tra log hệ thống kernel: `dmesg -T | grep -i oom` (thấy dòng `Memory cgroup out of memory: Killed process ... java`).",
        "3. Soi chi tiết bộ nhớ: Java Memory = Heap + Metaspace + CodeCache + (Threads * 1MB) + Garbage Collector overhead."
      ],
      rootCauseExplained: "Nếu set `-Xmx512m` bằng đúng memory limit của container, tổng bộ nhớ thực tế của process Java (bao gồm non-heap, thread stack, native memory) sẽ vượt qua 512MB, khiến Linux Kernel cgroup kích hoạt OOM Killer hạ sát tiến trình ngay lập tức.",
      fixSolution: "Dùng `-XX:MaxRAMPercentage=75.0` thay vì hardcode `-Xmx`. Để lại 25% RAM còn lại cho OS page cache và JVM native memory."
    },
    whyQuestions: [
      {
        question: "Tại sao trong Dockerfile của Java backend, luôn phải copy file `pom.xml` hoặc `build.gradle` và chạy download dependencies trước khi copy toàn bộ source code?",
        answer: "Docker cache từng layer theo hash của input file. Source code thay đổi liên tục sau mỗi commit, trong khi thư viện bên ngoài (dependencies) rất ít khi thay đổi. Việc tải dependencies trước giúp Docker tái sử dụng cache layer này, giảm thời gian build từ 5 phút xuống còn 10 giây.",
        keyPoints: ["Docker layer caching", "Layer invalidation order", "Tiết kiệm băng thông và thời gian build"]
      },
      {
        question: "Tại sao không nên dùng image `openjdk:latest` làm base image production cho Spring Boot?",
        answer: "1. Kích thước khổng lồ (> 800MB) chứa cả trình biên dịch JDK và công cụ gỡ lỗi thừa thãi. 2. Bề mặt tấn công lớn (chứa hàng trăm CVE tiềm ẩn). 3. Thay vào đó nên dùng `eclipse-temurin:21-jre-alpine` hoặc `gcr.io/distroless/java21-debian12` chỉ chứa runtime tối thiểu (~150MB) và không có shell.",
        keyPoints: ["Attack surface reduction", "Kích thước image nhỏ gọn", "Distroless / Alpine JRE"]
      }
    ],
    cheatSheet: [
      { command: "docker build -t my-app:1.0.0 .", description: "Build image từ Dockerfile trong thư mục hiện tại" },
      { command: "docker run -d -p 8080:8080 -m 512m --cpus=1 --name api my-app:1.0.0", description: "Chạy container với giới hạn RAM 512MB và 1 CPU core" },
      { command: "docker stats", description: "Xem live CPU, Memory, Network I/O của các container đang chạy" },
      { command: "docker inspect <container> | grep -i oomkilled", description: "Kiểm tra xem container có bị Linux OOM Killer bắn hạ không" },
      { command: "docker system prune -a --volumes", description: "Dọn dẹp triệt để các dangling images, containers và volumes thừa" }
    ],
    labAndDocs: [
      { name: "Play with Docker Free Lab", url: "https://labs.play-with-docker.com/", type: "lab" },
      { name: "Docker Best Practices for Java (Official)", url: "https://docs.docker.com/language/java/", type: "doc" },
      { name: "Distroless Images (GoogleContainerTools)", url: "https://github.com/GoogleContainerTools/distroless", type: "doc" }
    ]
  },
  {
    id: 4,
    weekNumber: 4,
    phaseId: 2,
    phaseName: "Containerization & CI/CD",
    title: "Docker Compose & Kiến trúc Multi-Service Backend",
    tagline: "Gắn kết Spring Boot, PostgreSQL, Redis và Kafka trong môi trường biệt lập bằng docker-compose",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "blue",
    skills: ["Docker Compose v2", "Bridge Networks", "Named Volumes", "Healthcheck Dependency", "Kafka & Zookeeper/KRaft"],
    javaSpecificFocus: "Cấu hình dynamic environment variables và healthcheck `condition: service_healthy` để Spring Boot không crash khi chờ Postgres/Kafka sẵn sàng.",
    coreConcepts: [
      "Docker Compose Spec: Quản lý hạ tầng multi-container bằng file khai báo YAML duy nhất",
      "Docker Network Drivers: Default bridge vs User-defined custom bridge (tự động phân giải DNS nội bộ theo tên service)",
      "Dữ liệu bền vững: Phân biệt Bind Mount (mount thư mục host) và Named Volumes (do Docker daemon quản lý)",
      "Giải quyết bài toán phụ thuộc khởi động: `depends_on` với `condition: service_healthy` thay vì phụ thuộc đơn thuần",
      "Tích hợp cụm: Spring Boot App + PostgreSQL + Redis Cache + Apache Kafka (KRaft mode) + Kafdrop UI"
    ],
    breakAndDebug: {
      title: "Spring Boot crash vòng lặp do PostgreSQL chưa kịp mở port kết nối",
      scenario: "Khi chạy `docker compose up`, container Spring Boot lập tức exit với lỗi `Connection refused` hoặc `Flyway migration failed` dù đã khai báo `depends_on: [postgres]`.",
      howToBreak: "Dùng `depends_on` thông thường. Docker chỉ chờ container PostgreSQL ở trạng thái `running` (process bắt đầu khởi tạo) chứ không đợi cho đến khi Postgres sẵn sàng nhận kết nối ở port 5432.",
      howToDebug: [
        "1. Xem log theo từng service: `docker compose logs -f postgres` vs `docker compose logs -f app`.",
        "2. Kiểm tra trạng thái chi tiết: `docker compose ps` (thấy app exited còn postgres vẫn đang initializing).",
        "3. Dùng lệnh `docker compose exec postgres pg_isready -U user` để test trực tiếp trạng thái database."
      ],
      rootCauseExplained: "Container trạng thái 'Running' không đồng nghĩa với 'Application Ready'. Postgres cần vài giây để initialize database, chạy scripts ban đầu rồi mới lắng nghe kết nối TCP.",
      fixSolution: "Thêm block `healthcheck` vào service Postgres với lệnh `pg_isready`, và trong service Spring Boot cấu hình `depends_on: { postgres: { condition: service_healthy } }`."
    },
    whyQuestions: [
      {
        question: "Tại sao trong file cấu hình Spring Boot chạy trong Docker Compose, `spring.datasource.url` phải là `jdbc:postgresql://postgres:5432/mydb` chứ không thể là `localhost:5432`?",
        answer: "Mỗi container sở hữu một Network Namespace riêng với loopback interface riêng. `localhost` bên trong container app chỉ trỏ về chính nó. Trong user-defined bridge network của Docker Compose, Docker nhúng một DNS server nội bộ (127.0.0.11) tự động map service name `postgres` thành IP của container database.",
        keyPoints: ["Isolated network namespaces", "Localhost inside container", "Embedded Docker DNS resolver"]
      },
      {
        question: "Tại sao không nên dùng Docker Compose để triển khai ứng dụng trên môi trường Production quy mô lớn?",
        answer: "Docker Compose chỉ chạy trên 1 host duy nhất (single node), không có cơ chế tự động điều phối khi server vật lý chết, không tự động co giãn (Auto-scaling), không hỗ trợ Zero-downtime rolling update nâng cao và không có khả năng tự phục hồi (Self-healing) trên multi-node như Kubernetes.",
        keyPoints: ["Single node limitation", "No multi-host orchestration", "Lack of auto-scaling & self-healing"]
      }
    ],
    cheatSheet: [
      { command: "docker compose up -d --build", description: "Build lại images và chạy toàn bộ service ở background" },
      { command: "docker compose ps -a", description: "Liệt kê trạng thái và health status của tất cả services" },
      { command: "docker compose logs -f --tail=100 app", description: "Theo dõi realtime log của service backend" },
      { command: "docker compose exec db psql -U postgres -d mydb", description: "Truy cập trực tiếp console PostgreSQL bên trong container" },
      { command: "docker compose down -v", description: "Dừng các container và xóa sạch cả Named Volumes đính kèm" }
    ],
    labAndDocs: [
      { name: "Docker Compose Specification", url: "https://docs.docker.com/compose/", type: "doc" },
      { name: "Compose Samples Repository", url: "https://github.com/docker/awesome-compose", type: "lab" },
      { name: "Spring Boot with Docker Guide", url: "https://spring.io/guides/gs/spring-boot-docker/", type: "doc" }
    ]
  },
  {
    id: 5,
    weekNumber: 5,
    phaseId: 2,
    phaseName: "Containerization & CI/CD",
    title: "Tự động hóa CI/CD với GitHub Actions",
    tagline: "Xây dựng pipeline kiểm thử tự động, quét chất lượng code và build Docker image đẩy lên Container Registry",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "rose",
    skills: ["GitHub Actions", "Workflows & Jobs", "Matrix Builds", "Dependency Caching", "Docker Buildx", "GHCR Registry"],
    javaSpecificFocus: "Cấu hình cache thư mục `.m2` hoặc Gradle wrapper để rút ngắn thời gian pipeline từ 8 phút xuống dưới 1 phút.",
    coreConcepts: [
      "Cấu trúc GitHub Actions: Events, Workflows, Jobs, Steps, Actions và Runners",
      "Khai báo Pipeline `.github/workflows/ci.yml`: Chạy tự động khi có Pull Request vào nhánh `main`",
      "Tối ưu tốc độ CI: `actions/cache` cho Maven dependencies và Docker Buildx layer caching (`cache-from=gha`)",
      "Automated Quality Gates: Chạy JUnit 5 tests, Testcontainers cho integration test, xuất JaCoCo coverage",
      "Security & Artifacts: Quét bí mật rò rỉ (TruffleHog), build multi-arch image (amd64/arm64) và push vào GHCR"
    ],
    breakAndDebug: {
      title: "Pipeline bị nghẽn 15 phút và push Docker image bị lỗi 403 Forbidden",
      scenario: "Mỗi lần tạo Pull Request, GitHub Actions runner tải lại toàn bộ Maven dependencies từ đầu gây tốn thời gian. Đến bước đẩy Docker image lên GHCR thì bị lỗi `denied: installation not allowed to Create organization package`.",
      howToBreak: "Không khai báo `cache: 'maven'` trong `actions/setup-java`, và quên cấp quyền `packages: write` cho token trong file workflow.",
      howToDebug: [
        "1. Bật debug logging trên GitHub Actions bằng cách đặt secret `ACTIONS_RUNNER_DEBUG=true`.",
        "2. Kiểm tra phần `permissions` ở đầu file YAML workflow.",
        "3. Kiểm tra log bước `docker/login-action` để xem token xác thực có hợp lệ không."
      ],
      rootCauseExplained: "Mặc định `GITHUB_TOKEN` chỉ có quyền read-only để đảm bảo an toàn. Muốn push image lên GitHub Packages / GHCR, workflow phải được cấp quyền tường minh `permissions: packages: write`.",
      fixSolution: "Thêm block permissions và cấu hình `cache: 'maven'` trong `setup-java`, tích hợp `docker/build-push-action` với GitHub Actions cache."
    },
    whyQuestions: [
      {
        question: "Tại sao nguyên tắc cốt lõi của CI/CD là 'Build Once, Deploy Everywhere' (chỉ build Docker image 1 lần duy nhất)?",
        answer: "Nếu build lại source code ở từng môi trường (Staging, UAT, Prod), không có gì đảm bảo artifact trên Prod giống 100% artifact đã được test trên Staging (do khác biệt thư viện phụ thuộc, thời điểm build, commit mới bị lọt vào). Cần build và test 1 image duy nhất với Git Commit SHA tag, sau đó đẩy cùng image đó qua các môi trường, chỉ thay đổi biến môi trường (Environment Variables).",
        keyPoints: ["Immutability of artifacts", "Predictability", "Tránh drift giữa Staging và Production"]
      },
      {
        question: "Khi nào nên dùng Self-hosted Runner thay vì GitHub-hosted Runner của GitHub?",
        answer: "1. Tiết kiệm chi phí khi chạy khối lượng job khổng lồ liên tục. 2. Cần cấu hình phần cứng đặc biệt (GPU, RAM > 64GB). 3. Bảo mật mạng: Pipeline cần truy cập tài nguyên trong VPC nội bộ mà không muốn mở port ra Internet công cộng.",
        keyPoints: ["Cost efficiency at scale", "Private network / VPC access", "Hardware customization"]
      }
    ],
    cheatSheet: [
      { command: "gh workflow run ci.yml", description: "Kích hoạt thủ công workflow từ terminal bằng GitHub CLI" },
      { command: "act -j build", description: "Chạy và kiểm tra thử GitHub Actions workflow ngay tại máy local bằng công cụ `act`" },
      { command: "echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin", description: "Đăng nhập vào GitHub Container Registry từ CLI" },
      { command: "gh run list --workflow=ci.yml", description: "Xem danh sách trạng thái các lần chạy pipeline gần nhất" },
      { command: "mvn verify jacoco:report", description: "Chạy test và sinh báo cáo độ phủ mã nguồn JaCoCo" }
    ],
    labAndDocs: [
      { name: "GitHub Actions Official Docs", url: "https://docs.github.com/en/actions", type: "doc" },
      { name: "Act: Run GitHub Actions locally", url: "https://github.com/nektos/act", type: "lab" },
      { name: "Continuous Delivery (Jez Humble & David Farley)", url: "https://continuousdelivery.com/", type: "book" }
    ]
  },
  {
    id: 6,
    weekNumber: 6,
    phaseId: 3,
    phaseName: "Cloud & Kubernetes Orchestration",
    title: "Nền tảng Cloud (AWS) & Hạ tầng dạng mã (Terraform)",
    tagline: "Khai báo VPC, Subnets, EC2 và Database RDS bằng Terraform thay vì cấu hình thủ công qua giao diện Console",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "yellow",
    skills: ["AWS VPC & Subnets", "Security Groups", "RDS PostgreSQL", "Terraform HCL", "State Management", "S3 Backend"],
    javaSpecificFocus: "Thiết kế topology mạng chuẩn: Spring Boot backend và PostgreSQL RDS bắt buộc nằm trong Private Subnet không có IP public.",
    coreConcepts: [
      "Kiến trúc Cloud VPC chuẩn: Public Subnet (NAT Gateway, ALB) vs Private Subnet (Backend EC2, RDS Database)",
      "An toàn mạng: Phân biệt Security Groups (Stateful, áp dụng cấp Instance) và Network ACLs (Stateless, cấp Subnet)",
      "Terraform Core Concepts: Providers, Resources, Variables, Outputs, Data Sources và State",
      "State Management an toàn: Lưu `terraform.tfstate` trên AWS S3 Bucket với State Locking bằng DynamoDB",
      "Quy trình Terraform an toàn: `terraform plan` kiểm tra trước mọi thay đổi trước khi chạy `terraform apply`"
    ],
    breakAndDebug: {
      title: "Ứng dụng không thể kết nối tới RDS do cấu hình Security Group và Route Table sai",
      scenario: "Tạo thành công EC2 và RDS Postgres bằng Terraform, nhưng Spring Boot khi khởi động báo lỗi `Connection to database:5432 timed out`.",
      howToBreak: "Quên gắn NAT Gateway cho Private Subnet chứa EC2, hoặc Security Group của RDS chưa mở port 5432 cho Security Group ID của EC2.",
      howToDebug: [
        "1. SSH vào bastion host hoặc dùng AWS SSM Session Manager để vào EC2 private.",
        "2. Kiểm tra routing bảng định tuyến: `traceroute <rds_endpoint>`.",
        "3. Thử kết nối TCP port bằng lệnh `nc -zv <rds_endpoint> 5432`.",
        "4. Soi cấu hình Security Group trên file Terraform: Ingress rule của RDS phải reference `security_groups = [aws_security_group.ec2.id]`."
      ],
      rootCauseExplained: "Security Group mặc định chặn toàn bộ kết nối đi vào (Inbound Deny All). Nếu chỉ tạo RDS mà không cho phép SG của Backend gọi sang port 5432, kết nối sẽ bị drop âm thầm mà không trả về lỗi cụ thể.",
      fixSolution: "Bổ sung rule trong Terraform cho phép ingress từ `aws_security_group.backend.id` vào RDS, kiểm tra Subnet Route Table trỏ đúng target."
    },
    whyQuestions: [
      {
        question: "Tại sao file `terraform.tfstate` không bao giờ được commit lên Git repository?",
        answer: "1. `tfstate` chứa dữ liệu nhạy cảm ở dạng plain-text (database password, TLS private keys, IAM secret keys). 2. Rủi ro xung đột state (State Race Condition) khi nhiều kỹ sư cùng chạy đồng thời. Giải pháp bắt buộc là dùng Remote Backend (S3 + DynamoDB State Lock) và đưa `*.tfstate` vào `.gitignore`.",
        keyPoints: ["Plaintext sensitive credentials", "State concurrency & corruption", "S3 remote backend with DynamoDB lock"]
      },
      {
        question: "Sự khác biệt cốt lõi giữa Security Group và Network ACL (NACL) trong AWS là gì?",
        answer: "Security Group hoạt động ở tầng Network Interface (EC2/RDS), có tính chất Stateful (nếu cho phép Inbound thì tự động cho phép Outbound phản hồi tương ứng). NACL hoạt động ở tầng Subnet, có tính chất Stateless (phải cấu hình cả 2 chiều Inbound và Outbound tường minh bao gồm ephemeral ports).",
        keyPoints: ["Stateful vs Stateless", "Instance level vs Subnet level", "Rule evaluation order"]
      }
    ],
    cheatSheet: [
      { command: "terraform init", description: "Tải provider plugins và khởi tạo kết nối tới remote backend S3" },
      { command: "terraform plan -out=tfplan", description: "Xem trước những tài nguyên sẽ được tạo/sửa/xóa và lưu plan" },
      { command: "terraform apply tfplan", description: "Áp dụng chính xác các thay đổi đã được review trong file plan" },
      { command: "terraform state list", description: "Liệt kê toàn bộ tài nguyên hiện đang được quản lý bởi state" },
      { command: "terraform fmt -recursive", description: "Tự động chuẩn hóa format code Terraform theo chuẩn HashiCorp" }
    ],
    labAndDocs: [
      { name: "Terraform Tutorials (HashiCorp Learn)", url: "https://developer.hashicorp.com/terraform/tutorials", type: "doc" },
      { name: "LocalStack: Local AWS Cloud Emulator", url: "https://localstack.cloud/", type: "lab" },
      { name: "Terraform: Up & Running (Yevgeniy Brikman)", url: "https://www.terraformupandrunning.com/", type: "book" }
    ]
  },
  {
    id: 7,
    weekNumber: 7,
    phaseId: 3,
    phaseName: "Cloud & Kubernetes Orchestration",
    title: "Kubernetes Nền tảng: Kiến trúc, Pods, Deployments & Services",
    tagline: "Hiểu sâu cơ chế Control Plane, Pod Lifecycle, Rolling Update và Service Discovery trong K8s",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "teal",
    skills: ["K8s Architecture", "etcd & kube-apiserver", "Pods & ReplicaSets", "Rolling Updates", "ClusterIP / NodePort", "CoreDNS"],
    javaSpecificFocus: "Quản lý vòng đời Pod khi triển khai Spring Boot để không làm gián đoạn request của khách hàng khi release phiên bản mới.",
    coreConcepts: [
      "Kiến trúc Kubernetes: Control Plane (API Server, etcd, Scheduler, Controller Manager) vs Worker Node (Kubelet, Kube-proxy, Containerd)",
      "Nguyên lý Reconcile Loop: Trạng thái mong muốn (Desired State trong YAML) vs Trạng thái thực tế (Actual State)",
      "Pod Lifecycle: Pending → Running → Succeeded/Failed, CrashLoopBackOff và ImagePullBackOff",
      "Deployment Controller: Quản lý ReplicaSet và chiến lược Rolling Update (`maxSurge` và `maxUnavailable`)",
      "Kubernetes Services: Cơ chế ClusterIP, NodePort, LoadBalancer và cách CoreDNS phân giải service name"
    ],
    breakAndDebug: {
      title: "Giải cứu Pod bị kẹt `CrashLoopBackOff` và `ImagePullBackOff`",
      scenario: "Sau khi apply manifest Deployment, Pod của Spring Boot liên tục restart rồi rơi vào trạng thái `CrashLoopBackOff`. Không có traffic nào đến được ứng dụng.",
      howToBreak: "Cấu hình sai tag image trong Deployment YAML (ví dụ `my-repo/app:tag-not-exist`) hoặc truyền thiếu biến môi trường database bắt buộc khiến Spring Boot fail khi start.",
      howToDebug: [
        "1. Xem tổng quan trạng thái: `kubectl get pods -l app=backend`.",
        "2. Kiểm tra sự kiện K8s: `kubectl describe pod <pod-name>` (tìm phần `Events:` ở cuối - nơi Kubelet ghi nhận lỗi).",
        "3. Soi log container bị crash gần nhất: `kubectl logs <pod-name> --previous` (tham số `--previous` là chìa khóa vàng khi container đã chết).",
        "4. Nếu cần rollback gấp: `kubectl rollout undo deployment/backend-deployment`."
      ],
      rootCauseExplained: "`CrashLoopBackOff` là cơ chế bảo vệ của Kubelet: khi container exit với mã lỗi khác 0, Kubelet sẽ thử restart với thuật toán back-off tăng dần thời gian chờ (10s, 20s, 40s...) để tránh làm quá tải server.",
      fixSolution: "Dùng `kubectl logs --previous` để đọc stacktrace của Spring Boot, sửa đúng biến môi trường hoặc tag image, sau đó apply lại."
    },
    whyQuestions: [
      {
        question: "Tại sao không bao giờ nên chạy Pod độc lập (Standalone Pod) trên Production mà luôn phải thông qua Deployment?",
        answer: "Pod độc lập không được quản lý bởi Controller nào. Nếu Node chứa Pod bị chết (hardware failure, out of memory), Kubernetes sẽ KHÔNG tự động tạo lại Pod đó trên Node khác. Deployment quản lý ReplicaSet, đảm bảo luôn duy trì đủ số lượng replica mong muốn và hỗ trợ Rolling Update, Rollback.",
        keyPoints: ["No self-healing for raw pods", "ReplicaSet orchestration", "Rolling update & Rollback capabilities"]
      },
      {
        question: "Làm thế nào Kubernetes Service có thể định tuyến lưu lượng ổn định tới các Pod dù Pod IP liên tục thay đổi khi restart?",
        answer: "Service sử dụng cơ chế `Selector` để chọn các Pod có `Labels` tương ứng và tự động cập nhật danh sách IP này vào đối tượng `Endpoints` (hoặc `EndpointSlice`). Kube-proxy cấu hình các iptables hoặc IPVS rules trên từng node để đón traffic gửi tới IP ảo của Service (ClusterIP) và cân bằng tải tới IP thực của các Pod khỏe mạnh.",
        keyPoints: ["Labels and Selectors", "Endpoints / EndpointSlice controller", "Kube-proxy iptables / IPVS rules"]
      }
    ],
    cheatSheet: [
      { command: "kubectl get all -o wide", description: "Xem tổng quát toàn bộ pods, services, deployments cùng IP và Node" },
      { command: "kubectl describe pod <pod-name>", description: "Xem chi tiết thông tin và danh sách Events của một Pod" },
      { command: "kubectl logs -f <pod-name> -c <container-name> --previous", description: "Xem log của container ngay trước lần crash gần nhất" },
      { command: "kubectl rollout status deployment/<deployment-name>", description: "Theo dõi tiến trình triển khai Rolling Update" },
      { command: "kubectl port-forward svc/<service-name> 8080:8080", description: "Forward port từ K8s Service về máy local để kiểm thử nhanh" }
    ],
    labAndDocs: [
      { name: "Killercoda Interactive Kubernetes Lab", url: "https://killercoda.com/playgrounds/scenario/kubernetes", type: "lab" },
      { name: "Kubernetes Up & Running (Brendan Burns, Joe Beda)", url: "https://www.oreilly.com/library/view/kubernetes-up-and/9781492043607/", type: "book" },
      { name: "Kubernetes Documentation (Official)", url: "https://kubernetes.io/docs/home/", type: "doc" }
    ]
  },
  {
    id: 8,
    weekNumber: 8,
    phaseId: 3,
    phaseName: "Cloud & Kubernetes Orchestration",
    title: "Kubernetes Nâng cao: Config, Storage & Probes cho Spring Boot",
    tagline: "Làm chủ ConfigMap, Secret, Persistent Volume, Resource Limits và Healthcheck Probes",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "orange",
    skills: ["ConfigMaps & Secrets", "PVC & StorageClass", "Startup/Liveness/Readiness", "Resource Requests/Limits", "Actuator Probes"],
    javaSpecificFocus: "Cấu hình chính xác StartupProbe và LivenessProbe dựa trên Spring Boot Actuator (`/actuator/health/liveness`) tránh việc Kubelet giết Pod khi Spring context đang khởi tạo.",
    coreConcepts: [
      "Quản lý cấu hình tách biệt: ConfigMap (plain text) và Secret (base64 mã hóa/bảo vệ tại rest) mount vào Pod",
      "Persistent Storage: PersistentVolume (PV), PersistentVolumeClaim (PVC) và Dynamic Provisioning với StorageClass",
      "Bộ 3 Healthcheck Probes: `startupProbe` (bảo vệ ứng dụng khởi động chậm), `livenessProbe` (phát hiện deadlock) và `readinessProbe` (sẵn sàng nhận traffic)",
      "Spring Boot 3 Actuator Probes: Tự động publish endpoint `/actuator/health/liveness` và `/readiness`",
      "Resource Management: `requests` (để Scheduler xếp chỗ) và `limits` (ngăn chặn noisy neighbor, CPU throttling và OOMKilled)"
    ],
    breakAndDebug: {
      title: "Kubelet liên tục giết Pod Spring Boot vì cấu hình Liveness Probe quá hấp tấp",
      scenario: "Spring Boot cần 25 giây để nạp các beans và kết nối database lúc khởi động. Nhưng cứ sau 10 giây là Pod lại bị restart liên tục.",
      howToBreak: "Chỉ cấu hình `livenessProbe` với `initialDelaySeconds: 5` và `periodSeconds: 5`, không dùng `startupProbe`.",
      howToDebug: [
        "1. Dùng `kubectl describe pod <pod-name>` (thấy thông báo `Liveness probe failed: HTTP probe failed with statuscode: 503` hoặc connection refused).",
        "2. Kiểm tra thời gian khởi động trong log Spring Boot: `Started Application in 24.32 seconds`.",
        "3. Nhận ra Kubelet đã gửi SIGTERM giết Pod trong khi JVM đang bận load Hibernate và Flyway migration."
      ],
      rootCauseExplained: "Nếu không có StartupProbe, LivenessProbe sẽ bắt đầu thăm dò ngay. Nếu ứng dụng Java khởi động chậm do tải nhiều data, LivenessProbe sẽ đếm quá `failureThreshold` và coi app đã chết, gây ra vòng lặp restart vĩnh viễn.",
      fixSolution: "Bổ sung `startupProbe` với `failureThreshold: 30` và `periodSeconds: 2` (cho phép ứng dụng tối đa 60 giây để khởi động xong). Chỉ khi startupProbe pass thì livenessProbe mới bắt đầu kiểm tra."
    },
    whyQuestions: [
      {
        question: "Sự khác biệt sống còn giữa Liveness Probe và Readiness Probe trong Kubernetes là gì?",
        answer: "Liveness Probe kiểm tra xem ứng dụng có còn sống không: nếu fail, Kubelet sẽ GIẾT và TẠO LẠI Pod (phù hợp khi deadlock, crash). Readiness Probe kiểm tra xem Pod có sẵn sàng phục vụ request không: nếu fail, Kubelet chỉ TẠM GỠ IP của Pod ra khỏi Endpoints của Service, KHÔNG giết Pod (phù hợp khi Pod đang quá tải hoặc đang nạp cache).",
        keyPoints: ["Liveness: Restart container on failure", "Readiness: Remove from service endpoints", "Tránh gửi traffic vào Pod chưa sẵn sàng"]
      },
      {
        question: "Tại sao nên luôn cấu hình `memory.requests = memory.limits` (Guaranteed QoS) cho container Java trên Kubernetes?",
        answer: "Nếu `limits` cao hơn `requests`, khi Node bị thiếu RAM, Kubernetes sẽ kích hoạt OOM Killer để hạ sát các Pod thuộc nhóm Burstable (có limit > request) trước. Đặt `requests = limits` đưa Pod vào nhóm Guaranteed (ưu tiên bảo vệ cao nhất) và giúp JVM cấu hình `-XX:MaxRAMPercentage` chính xác, không bị tính toán sai theo RAM máy host.",
        keyPoints: ["Kubernetes QoS Classes (Guaranteed vs Burstable)", "OOM Killer eviction score", "JVM Heap sizing stability"]
      }
    ],
    cheatSheet: [
      { command: "kubectl top pods -n default", description: "Xem mức tiêu thụ CPU và Memory thực tế của từng Pod" },
      { command: "kubectl get secret my-secret -o jsonpath='{.data.password}' | base64 -d", description: "Giải mã xem nội dung của một K8s Secret" },
      { command: "kubectl get pv,pvc", description: "Kiểm tra trạng thái liên kết (Bound) của Persistent Volumes" },
      { command: "kubectl edit deployment backend", description: "Sửa trực tiếp manifest Deployment đang chạy trên cluster" },
      { command: "kubectl apply -f k8s/", description: "Áp dụng toàn bộ file manifest cấu hình trong thư mục" }
    ],
    labAndDocs: [
      { name: "Kubernetes Actuator Health Guide (Spring.io)", url: "https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.endpoints.kubernetes-probes", type: "doc" },
      { name: "Managing Resources for Containers (K8s Docs)", url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", type: "doc" },
      { name: "Production Kubernetes (Josh Rosso, Rich Lander)", url: "https://www.oreilly.com/library/view/production-kubernetes/9781492092292/", type: "book" }
    ]
  },
  {
    id: 9,
    weekNumber: 9,
    phaseId: 3,
    phaseName: "Cloud & Kubernetes Orchestration",
    title: "Quản lý gói Helm & Triển khai GitOps với ArgoCD",
    tagline: "Đóng gói microservices thành Helm Charts có thể tái sử dụng và đồng bộ hóa hạ tầng tự động bằng GitOps",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "blue",
    skills: ["Helm Charts", "Values.yaml", "Chart Templating", "GitOps Principles", "ArgoCD", "Self-Healing"],
    javaSpecificFocus: "Tạo 1 Generic Helm Chart dùng chung cho toàn bộ các microservices Java Spring Boot trong công ty.",
    coreConcepts: [
      "Vấn đề YAML Hell: Tại sao copy-paste hàng trăm file YAML thủ công gây lỗi khi triển khai đa môi trường (Dev/Staging/Prod)",
      "Helm Package Manager: Chart structure, `Chart.yaml`, `values.yaml`, templates và built-in objects (`.Values`, `.Release`)",
      "Helm Lifecycle: `helm install`, `upgrade`, `rollback` và kiểm tra template bằng `helm template`",
      "GitOps Core Philosophy: Git là Single Source of Truth duy nhất cho toàn bộ trạng thái hệ thống",
      "ArgoCD Architecture: Pull-based model, Application CRD, Auto-sync, OutOfSync detection và Self-healing"
    ],
    breakAndDebug: {
      title: "Chạy đua sửa đổi thủ công và chứng kiến cơ chế Self-Healing của ArgoCD",
      scenario: "Một kỹ sư dùng lệnh `kubectl edit` để sửa trực tiếp số lượng replica từ 3 lên 10 trên cluster. Tuy nhiên chỉ 15 giây sau, cluster tự động rollback về lại 3.",
      howToBreak: "Sửa tài nguyên trên cluster bằng CLI `kubectl scale deployment backend --replicas=10` trong khi ArgoCD đang quản lý ứng dụng đó với cờ `selfHeal: true`.",
      howToDebug: [
        "1. Mở giao diện ArgoCD UI hoặc chạy `argocd app get backend-app`.",
        "2. Quan sát trạng thái chuyển thành `OutOfSync`.",
        "3. Xem event log của ArgoCD: Controller phát hiện sai lệch giữa Git và Live Cluster và kích hoạt Sync để ép Live Cluster về trạng thái khai báo trong Git."
      ],
      rootCauseExplained: "Nguyên lý cốt lõi của GitOps: Git là chân lý tối thượng. Mọi sửa đổi bằng tay trên cluster bị coi là trôi dạt hạ tầng (Configuration Drift) và ArgoCD Self-Heal sẽ xóa bỏ sự trôi dạt đó để bảo đảm an toàn hệ thống.",
      fixSolution: "Muốn tăng replica lên 10, kỹ sư phải tạo commit sửa file `values.yaml` trên Git repository và merge Pull Request."
    },
    whyQuestions: [
      {
        question: "Tại sao mô hình Pull-based GitOps (ArgoCD trong cluster tự kéo manifest từ Git) lại an toàn vượt trội so với Push-based (GitHub Actions nắm quyền `kubectl apply`)?",
        answer: "1. Trong mô hình Push, bạn phải cấp quyền Admin Kubeconfig cho server CI bên ngoài (rủi ro lộ credentials rất cao). 2. Trong mô hình Pull, ArgoCD nằm bên trong firewall nội bộ của cluster, chỉ cần quyền đọc Git repo, không bao giờ phải mở API server của K8s ra internet công cộng.",
        keyPoints: ["No external cluster credentials in CI", "Internal pull agent pattern", "Audit trail hoàn chỉnh 100% trên Git commit"]
      },
      {
        question: "Tại sao nên dùng Helm Library Chart hoặc generic chart cho các service Spring Boot thay vì mỗi service một chart riêng?",
        answer: "Các service Java Spring Boot chia sẻ đến 90% cấu trúc deployment giống nhau (cùng cần Ingress, Probes, JVM envs, ServiceAccount). Dùng generic chart giúp khi cần cập nhật best practice (như đổi base image, cập nhật PodSecurityStandard), ta chỉ cần sửa ở 1 nơi duy nhất thay vì sửa ở 50 repo khác nhau.",
        keyPoints: ["DRY (Don't Repeat Yourself) hạ tầng", "Centralized security updates", "Giảm tải bảo trì"]
      }
    ],
    cheatSheet: [
      { command: "helm create java-microservice", description: "Khởi tạo khung sườn mẫu cho một Helm chart mới" },
      { command: "helm template my-release ./my-chart -f values-prod.yaml", description: "Render và in ra toàn bộ YAML đã thế biến để kiểm tra trước" },
      { command: "helm upgrade --install backend ./my-chart -f values.yaml", description: "Cài đặt hoặc cập nhật release an toàn" },
      { command: "helm rollback backend 1", description: "Rollback release về phiên bản revision số 1 ngay lập tức" },
      { command: "argocd app sync backend-app", description: "Bắt buộc ArgoCD đồng bộ ngay lập tức từ Git xuống cluster" }
    ],
    labAndDocs: [
      { name: "Helm Official Documentation", url: "https://helm.sh/docs/", type: "doc" },
      { name: "ArgoCD Official Getting Started", url: "https://argo-cd.readthedocs.io/en/stable/", type: "doc" },
      { name: "GitOps and Kubernetes (Billy Yuen, Alexander Matyushentsev)", url: "https://www.manning.com/books/gitops-and-kubernetes", type: "book" }
    ]
  },
  {
    id: 10,
    weekNumber: 10,
    phaseId: 4,
    phaseName: "Observability, Security & Capstone",
    title: "Giám sát & Khả năng quan sát (Prometheus, Grafana, Micrometer & Loki)",
    tagline: "Làm chủ 3 trụ cột Observability: Metrics, Centralized Logs và Distributed Tracing cho Microservices",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "yellow",
    skills: ["Prometheus", "PromQL", "Grafana Dashboards", "Spring Micrometer", "Grafana Loki", "Alertmanager"],
    javaSpecificFocus: "Cấu hình Spring Boot Actuator kết hợp Micrometer để xuất các chỉ số JVM (GC pause time, Heap usage, HikariCP pool) và HTTP request latency.",
    coreConcepts: [
      "3 trụ cột Observability: Metrics (đo lường), Logs (sự kiện) và Traces (hành trình request)",
      "Spring Boot 3 + Micrometer: Cung cấp metrics chuẩn format Prometheus tại `/actuator/prometheus`",
      "Prometheus Architecture: Pull model, Time Series Database (TSDB), Scrape targets và PromQL cơ bản",
      "PromQL thực chiến: Tính tỷ lệ request (`rate`), đếm status 5xx, và tính phân vị P95/P99 latency (`histogram_quantile`)",
      "Centralized Logging: Thu thập log container bằng Promtail/FluentBit, lưu trữ trên Grafana Loki và hiển thị trên Grafana"
    ],
    breakAndDebug: {
      title: "Phát hiện nghẽn HikariCP Connection Pool và Alert khi tỷ lệ lỗi 5xx tăng vọt",
      scenario: "Hệ thống có hiện tượng response chậm bất thường trong đợt khuyến mãi. Cần viết PromQL để kiểm tra xem có phải do cạn kiệt Connection Pool kết nối Database hay do Garbage Collection.",
      howToBreak: "Đặt cấu hình HikariCP `maximum-pool-size: 5` trong khi mở 50 concurrent requests giữ connection lâu.",
      howToDebug: [
        "1. Truy cập Grafana, mở Explore và chạy câu lệnh PromQL: `hikaricp_connections_pending` (kết nối đang phải xếp hàng chờ).",
        "2. Kiểm tra thời gian GC: `rate(jvm_gc_pause_seconds_sum[1m])`.",
        "3. Đo latency P99 của API: `histogram_quantile(0.99, sum(rate(http_server_requests_seconds_bucket[5m])) by (le))`.",
        "4. Cấu hình Alert Rule trong Alertmanager gửi thông báo về Slack khi `hikaricp_connections_pending > 0` liên tục trong 2 phút."
      ],
      rootCauseExplained: "HikariCP pool size quá nhỏ so với số lượng luồng đồng thời, khiến các request sau phải chờ đợi cho đến khi đạt timeout `connection-timeout`, sinh ra hàng loạt lỗi 500.",
      fixSolution: "Điều chỉnh connection pool size phù hợp với năng lực của PostgreSQL server và cấu hình alerts giám sát trước khi người dùng phát hiện."
    },
    whyQuestions: [
      {
        question: "Tại sao tính Average Latency (thời gian phản hồi trung bình) là một chỉ số gây hiểu lầm tai hại trong giám sát backend, và tại sao bắt buộc phải dùng P95/P99?",
        answer: "Số trung bình (Average) bị làm phẳng bởi số đông: nếu 90 request chạy 10ms, nhưng 10 request mất tới 10,000ms (10 giây), trung bình chỉ là ~1 giây (nhìn có vẻ ổn). Nhưng 10% khách hàng chịu đựng 10 giây đó là những người trả tiền nhiều nhất hoặc giao dịch quan trọng nhất. P99 chỉ ra chính xác trải nghiệm của 1% người dùng chậm nhất.",
        keyPoints: ["The flaw of averages", "Percentile P95 and P99", "Tail latency impact on user experience"]
      },
      {
        question: "Tại sao Prometheus chọn mô hình Pull (server chủ động scrape) thay vì mô hình Push (ứng dụng tự bắn metrics về)?",
        answer: "1. Kiểm soát tải: Prometheus tự quyết định tần suất scrape, không bị DDOS bởi chính ứng dụng khi traffic tăng đột biến. 2. Health Monitoring tự nhiên: Nếu không scrape được target, Prometheus biết ngay instance đó đã chết. 3. Đơn giản hóa backend: Ứng dụng chỉ cần export text format ở một endpoint HTTP, không cần thư viện phức tạp kết nối tới monitoring cluster.",
        keyPoints: ["Pull vs Push model", "Protection against metric flooding", "Built-in target health detection"]
      }
    ],
    cheatSheet: [
      { command: "curl -s http://localhost:8080/actuator/prometheus | grep jvm_memory_used", description: "Kiểm tra endpoint xuất metrics của Spring Boot" },
      { command: "sum(rate(http_server_requests_seconds_count{status=~'5..'}[5m]))", description: "PromQL: Tính số lượng request lỗi 5xx trên mỗi giây" },
      { command: "histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le))", description: "PromQL: Tính thời gian phản hồi ở phân vị P95" },
      { command: "promtool check config prometheus.yml", description: "Kiểm tra tính hợp lệ của file cấu hình Prometheus" },
      { command: "logcli query '{app=\"backend\"} |= \"ERROR\"' --since=1h", description: "Truy vấn log lỗi từ Grafana Loki bằng dòng lệnh LogCLI" }
    ],
    labAndDocs: [
      { name: "Prometheus Monitoring Guide", url: "https://prometheus.io/docs/introduction/overview/", type: "doc" },
      { name: "Grafana Dashboards for Spring Boot", url: "https://grafana.com/grafana/dashboards/12900-spring-boot-statistics/", type: "doc" },
      { name: "Site Reliability Engineering (Google SRE Book - Free)", url: "https://sre.google/sre-book/table-of-contents/", type: "book" }
    ]
  },
  {
    id: 11,
    weekNumber: 11,
    phaseId: 4,
    phaseName: "Observability, Security & Capstone",
    title: "DevSecOps: Bảo mật Hạ tầng & Quản lý Bí mật",
    tagline: "Áp dụng Shift-Left Security: Quét lỗ hổng Image, PodSecurityStandards, NetworkPolicy và HashiCorp Vault",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "teal",
    skills: ["Trivy Vulnerability Scan", "SAST / SonarQube", "K8s NetworkPolicies", "PodSecurityAdmission", "External Secrets Operator", "Least Privilege"],
    javaSpecificFocus: "Quét lỗ hổng thư viện Java (CVE trong Maven dependencies) và cô lập database port chỉ cho phép Pod backend kết nối qua NetworkPolicy.",
    coreConcepts: [
      "Triết lý Shift-Left Security: Phát hiện và ngăn chặn lỗ hổng từ code và build time thay vì đợi lên Production",
      "Quét lỗ hổng tự động: Dùng Trivy để scan CVE trong Docker Image và phụ thuộc Maven trong CI pipeline",
      "Kubernetes Security Hardening: Chạy container với `readOnlyRootFilesystem: true`, `runAsNonRoot: true`, `drop: ['ALL']`",
      "NetworkPolicies: Thiết lập tường lửa bên trong cluster, cô lập namespace và chỉ mở traffic cần thiết giữa các pods",
      "Quản lý Secret chuẩn doanh nghiệp: Tích hợp AWS Secrets Manager / HashiCorp Vault vào Kubernetes qua External Secrets Operator"
    ],
    breakAndDebug: {
      title: "Chặn đứng tấn công leo thang đặc quyền và quét sạch CVE nghiêm trọng",
      scenario: "Container Java vô tình bị cài đặt quyền root và kẻ xấu có thể mount host filesystem. Ngoài ra image cũ chứa lỗ hổng RCE Log4j khét tiếng.",
      howToBreak: "Tạo một Pod manifest có `securityContext: privileged: true` và base image dùng phiên bản JDK lỗi thời.",
      howToDebug: [
        "1. Chạy Trivy quét image: `trivy image --severity HIGH,CRITICAL my-app:latest`.",
        "2. Áp dụng Pod Security Admission ở mức `restricted` lên namespace: `kubectl label namespace prod pod-security.kubernetes.io/enforce=restricted`.",
        "3. Thử apply lại Pod privileged (Kubelet lập tức từ chối và in ra cảnh báo vi phạm policy)."
      ],
      rootCauseExplained: "Nếu không có cơ chế giới hạn đặc quyền, một khi kẻ tấn công khai thác được một lỗ hổng trong code backend (như remote code execution), chúng có thể thoát ra khỏi container và chiếm quyền điều khiển toàn bộ node server.",
      fixSolution: "Cấu hình Pod SecurityContext non-root, bật NetworkPolicy chặn egress ra internet không mong muốn, và thêm bước Trivy scan tự động fail pipeline nếu phát hiện CVE CRITICAL."
    },
    whyQuestions: [
      {
        question: "Tại sao không bao giờ được lưu credentials trong K8s Secret thông thường và commit lên Git dù đã được mã hóa Base64?",
        answer: "Base64 KHÔNG PHẢI LÀ MÃ HÓA (Encryption), nó chỉ là một thuật toán Encoding dạng chữ. Bất kỳ ai cũng có thể giải mã Base64 ngược về plaintext chỉ bằng 1 lệnh `echo <string> | base64 -d`. Cần sử dụng các công cụ như Bitnami Sealed Secrets, Mozilla SOPS, hoặc External Secrets Operator kết hợp Vault/AWS Secrets Manager.",
        keyPoints: ["Base64 is encoding, not encryption", "Reverse decode in 1 second", "External Secrets Operator pattern"]
      },
      {
        question: "Tại sao trong Kubernetes mặc định mọi Pod đều có thể gọi đến mọi Pod khác trong cluster, và tại sao điều này nguy hiểm?",
        answer: "Mô hình mạng phẳng (Flat Network) mặc định của K8s ưu tiên sự thuận tiện phát triển. Tuy nhiên nếu một service công cộng (như frontend pod) bị xâm nhập, kẻ tấn công có thể quét mạng nội bộ và kết nối thẳng vào database pod. Bắt buộc phải triển khai NetworkPolicy với chính sách 'Default Deny All Ingress' và chỉ whitelist các luồng hợp lệ.",
        keyPoints: ["Default flat network model", "Lateral movement of attackers", "Default Deny Ingress NetworkPolicy"]
      }
    ],
    cheatSheet: [
      { command: "trivy image --severity CRITICAL my-java-app:1.0.0", description: "Quét các lỗ hổng bảo mật mức nghiêm trọng trong Docker image" },
      { command: "trivy fs --security-checks vuln,secret .", description: "Quét thư mục source code tìm mật khẩu bị lọt hoặc CVE thư viện" },
      { command: "kubectl auth can-i create pods --as=system:serviceaccount:dev:app-sa", description: "Kiểm tra phân quyền RBAC của một ServiceAccount cụ thể" },
      { command: "kubectl get networkpolicies", description: "Liệt kê danh sách các chính sách tường lửa mạng trong namespace" },
      { command: "kubectl get secretstore,externalsecret", description: "Xem trạng thái đồng bộ secret từ Vault hoặc AWS Secrets Manager" }
    ],
    labAndDocs: [
      { name: "Trivy Vulnerability Scanner Docs", url: "https://aquasecurity.github.io/trivy/", type: "doc" },
      { name: "Kubernetes Network Policies Guide", url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/", type: "doc" },
      { name: "Hacking Kubernetes (Andrew Martin, Michael Hausenblas)", url: "https://www.oreilly.com/library/view/hacking-kubernetes/9781492081722/", type: "book" }
    ]
  },
  {
    id: 12,
    weekNumber: 12,
    phaseId: 4,
    phaseName: "Observability, Security & Capstone",
    title: "Dự án Tốt nghiệp: Production Readiness, Zero-Downtime & Phỏng vấn",
    tagline: "Triển khai toàn diện hệ thống Microservices, Auto-scaling HPA, Zero-downtime Rolling Update và Diễn tập Phỏng vấn",
    duration: "10-14 giờ (1.5-2h/ngày)",
    stickyColor: "coral",
    skills: ["Capstone Architecture", "HPA Auto-scaling", "Zero-downtime Rollout", "Graceful Shutdown", "Chaos Testing", "System Interview"],
    javaSpecificFocus: "Cấu hình `server.shutdown=graceful` trong `application.yml` kết hợp `terminationGracePeriodSeconds` để không làm drop bất kỳ HTTP request nào khi K8s scale down Pod.",
    coreConcepts: [
      "Kiến trúc Tổng thể Capstone: Client → Cloudflare → Nginx Ingress → Spring Boot App (HPA) → PostgreSQL + Redis + Kafka",
      "Horizontal Pod Autoscaler (HPA): Tự động scale từ 2 lên 10 pods khi CPU > 70% hoặc Memory > 80%",
      "Bí quyết Zero-Downtime Deployment: Phối hợp giữa K8s Endpoints, PreStop Hook và Spring Boot Graceful Shutdown",
      "Kiểm thử tải & Chaos Engineering: Dùng k6 bắn tải 1000 req/s đồng thời tiến hành deploy version mới",
      "Tổng hợp 20 kịch bản phỏng vấn 'Tại sao?': Diễn tập trả lời lưu loát từ kiến trúc đến câu chuyện debug thực tế"
    ],
    breakAndDebug: {
      title: "Khắc phục lỗi 502 Bad Gateway ngắt quãng xảy ra trong quá trình Rolling Update",
      scenario: "Khi triển khai version mới trong lúc hệ thống đang có nhiều khách truy cập, Nginx Ingress báo rải rác mã lỗi `502 Bad Gateway` cho khoảng 0.5% requests.",
      howToBreak: "Bắn tải liên tục bằng k6: `k6 run --vus 100 --duration 1m load-test.js`, đồng thời chạy lệnh `kubectl set image deployment/app app=app:v2` mà không cấu hình PreStop Hook.",
      howToDebug: [
        "1. Xem log Nginx Ingress Controller: `kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx | grep '502'`.",
        "2. Phân tích dòng thời gian: Kubelet gửi SIGTERM đến Pod cũ cùng lúc với việc thông báo gỡ IP Pod khỏi Endpoints. Kube-proxy và Ingress Controller mất khoảng 1-2 giây để cập nhật iptables.",
        "3. Kết quả: Trong 1-2 giây đó, Ingress vẫn gửi request mới đến Pod cũ đã bắt đầu đóng cổng HTTP!"
      ],
      rootCauseExplained: "Quy trình xóa Pod diễn ra bất đồng bộ. Nếu không có `preStop hook: sleep 5`, Pod Java sẽ lập tức ngừng nhận kết nối mới trong khi Ingress chưa kịp cập nhật danh sách endpoints hợp lệ.",
      fixSolution: "Thêm `lifecycle: preStop: exec: command: ['/bin/sh', '-c', 'sleep 5']` vào container spec, và bật `server.shutdown: graceful` với timeout 30s trong Spring Boot."
    },
    whyQuestions: [
      {
        question: "Hãy mô tả chi tiết từng bước điều gì xảy ra từ lúc bạn gõ `git push` cho đến khi tính năng xuất hiện an toàn trên Production cluster?",
        answer: "1. GitHub nhận commit, trigger CI workflow. 2. Runner cache dependencies, chạy Unit Test & Testcontainers. 3. SonarQube kiểm tra Quality Gate. 4. Docker Buildx build multi-arch image, Trivy quét CVE, push lên Container Registry với tag là Git SHA. 5. Pipeline cập nhật image tag vào GitOps repo (hoặc Helm values). 6. ArgoCD phát hiện thay đổi trên Git, bắt đầu đồng bộ xuống Kubernetes. 7. K8s triển khai Rolling Update từng Pod mới, chờ ReadinessProbe pass mới tráo traffic từ Pod cũ sang Pod mới. 8. Prometheus theo dõi tỷ lệ 5xx và latency, nếu có bất thường kích hoạt cảnh báo rollback.",
        keyPoints: ["End-to-end DevOps pipeline lifecycle", "GitOps source of truth", "Zero-downtime progressive deployment", "Continuous feedback loop"]
      },
      {
        question: "Làm thế nào để bạn thuyết phục Tech Lead hoặc đồng nghiệp rằng việc đầu tư làm DevOps và CI/CD là đáng giá cho dự án backend?",
        answer: "Dựa trên 4 chỉ số vàng của DORA Metrics: 1. Tần suất triển khai (Deployment Frequency) tăng từ hàng tháng lên nhiều lần mỗi ngày. 2. Thời gian đưa tính năng ra thị trường (Lead Time for Changes) rút ngắn từ hàng tuần xuống vài chục phút. 3. Tỷ lệ triển khai thất bại (Change Failure Rate) giảm sâu nhờ test và security gates tự động. 4. Thời gian phục hồi sau sự cố (Mean Time to Restore) chỉ tính bằng phút nhờ khả năng Rollback tức thì của GitOps và Helm.",
        keyPoints: ["4 DORA Metrics", "Lead Time & Deployment Frequency", "MTTR and Change Failure Rate reduction"]
      }
    ],
    cheatSheet: [
      { command: "kubectl autoscale deployment backend --cpu-percent=70 --min=2 --max=10", description: "Bật HPA tự động scale số lượng Pod theo mức sử dụng CPU" },
      { command: "kubectl get hpa -w", description: "Theo dõi realtime hoạt động scale up / scale down của HPA" },
      { command: "k6 run --vus 50 --duration 30s load-test.js", description: "Chạy kịch bản kiểm thử tải với 50 concurrent users" },
      { command: "kubectl rollout history deployment/backend", description: "Xem lịch sử các phiên bản deployment đã phát hành" },
      { command: "kubectl rollout pause deployment/backend", description: "Tạm dừng quá trình rollout để kiểm tra Canary" }
    ],
    labAndDocs: [
      { name: "Zero-Downtime Deployment with Kubernetes", url: "https://learnk8s.io/graceful-shutdown", type: "doc" },
      { name: "k6 Performance & Load Testing Tool", url: "https://k6.io/docs/", type: "lab" },
      { name: "Accelerate: The Science of Lean Software and DevOps (Nicole Forsgren, Jez Humble, Gene Kim)", url: "https://itrevolution.com/product/accelerate/", type: "book" }
    ]
  }
];

export const CHEAT_SHEETS_BY_CATEGORY = [
  {
    category: "Linux & JVM Internals",
    icon: "terminal",
    commands: [
      { cmd: "top -H -p $(pgrep -f java)", desc: "Soi từng native OS thread con của JVM đang ngốn CPU" },
      { cmd: "printf '%x\\n' <THREAD_ID>", desc: "Chuyển native thread ID từ hệ Dec sang Hex để grep trong jstack" },
      { cmd: "jstack <PID> | grep -A 20 <NID_HEX>", desc: "Tìm đúng dòng code Java đang chiếm giữ CPU" },
      { cmd: "jcmd <PID> VM.flags", desc: "Xem toàn bộ tham số JVM Flags đang chạy ở runtime" },
      { cmd: "free -h", desc: "Xem bộ nhớ RAM máy chủ (ưu tiên xem cột available)" },
      { cmd: "journalctl -u <service> -f -n 100", desc: "Xem realtime 100 dòng log gần nhất của systemd service" },
      { cmd: "ss -tan | grep ':8080'", desc: "Đếm số lượng socket kết nối TCP (TIME_WAIT, ESTAB, CLOSE_WAIT)" },
      { cmd: "lsof -i :8080", desc: "Xem PID process nào đang lắng nghe cổng 8080" }
    ]
  },
  {
    category: "Docker & Container Runtime",
    icon: "container",
    commands: [
      { cmd: "docker build --no-cache -t app:latest .", desc: "Build image mới bỏ qua cache layer" },
      { cmd: "docker run -d -p 8080:8080 -m 512m --cpus=1 app", desc: "Chạy container với giới hạn 512MB RAM và 1 core CPU" },
      { cmd: "docker inspect <id> | grep -i oomkilled", desc: "Kiểm tra xem container có bị cgroups OOM Killer hạ sát không" },
      { cmd: "docker stats", desc: "Bảng điều khiển realtime mức độ dùng CPU/RAM của các container" },
      { cmd: "docker compose up -d --build", desc: "Rebuild và khởi động toàn bộ services ở background" },
      { cmd: "docker compose down -v", desc: "Dừng toàn bộ container và xóa sạch Named Volumes đính kèm" },
      { cmd: "docker system prune -af --volumes", desc: "Giải phóng toàn bộ dung lượng ổ đĩa bị chiếm bởi Docker" }
    ]
  },
  {
    category: "Kubernetes Core & Debugging",
    icon: "server",
    commands: [
      { cmd: "kubectl get pods -o wide --show-labels", desc: "Xem danh sách Pods kèm IP, Node và Labels" },
      { cmd: "kubectl describe pod <pod-name>", desc: "Xem chi tiết sự kiện Kubelet (Events: ImagePullBackOff, CrashLoop...)" },
      { cmd: "kubectl logs <pod-name> -c <container> --previous", desc: "Xem log của container ngay trước lần crash gần nhất" },
      { cmd: "kubectl exec -it <pod-name> -- /bin/sh", desc: "Truy cập shell bên trong Pod để debug mạng nội bộ" },
      { cmd: "kubectl rollout undo deployment/<name>", desc: "Rollback deployment về phiên bản hoạt động tốt trước đó" },
      { cmd: "kubectl top nodes && kubectl top pods", desc: "Xem mức tiêu hao CPU/RAM trên toàn cluster" },
      { cmd: "kubectl port-forward svc/<svc-name> 8080:8080", desc: "Mở tunnel kết nối trực tiếp vào Service từ máy cá nhân" }
    ]
  },
  {
    category: "GitOps, Helm & Observability",
    icon: "git",
    commands: [
      { cmd: "helm template release-name ./chart -f values.yaml", desc: "Render toàn bộ manifest YAML để kiểm tra lỗi cú pháp" },
      { cmd: "helm upgrade --install backend ./chart", desc: "Cài đặt hoặc cập nhật Helm release an toàn" },
      { cmd: "helm rollback backend 1", desc: "Quay về bản phát hành trước đó" },
      { cmd: "argocd app get <app-name>", desc: "Xem trạng thái Sync và Health của ứng dụng trong ArgoCD" },
      { cmd: "argocd app sync <app-name>", desc: "Bắt buộc ArgoCD đồng bộ ngay lập tức manifest từ Git" },
      { cmd: "trivy image --severity CRITICAL app:1.0", desc: "Quét lỗ hổng bảo mật mức nghiêm trọng trong Docker image" },
      { cmd: "promtool check config prometheus.yml", desc: "Kiểm tra tính hợp lệ của file cấu hình Prometheus" }
    ]
  }
];

export const RESOURCE_GUIDES = [
  {
    title: "Tài liệu & Sách kinh điển",
    items: [
      {
        name: "The Phoenix Project",
        author: "Gene Kim, Kevin Behr, George Spafford",
        description: "Tiểu thuyết kinh điển về chuyển đổi văn hóa DevOps, lý thuyết điểm nghẽn (Theory of Constraints) và luồng công việc tinh gọn.",
        link: "https://itrevolution.com/product/the-phoenix-project/",
        badge: "Tư duy"
      },
      {
        name: "Site Reliability Engineering (Google SRE Book)",
        author: "Google SRE Team",
        description: "Bộ cẩm nang kỹ thuật vận hành hệ thống phân tán quy mô toàn cầu của Google, đọc miễn phí trực tuyến.",
        link: "https://sre.google/sre-book/table-of-contents/",
        badge: "Vận hành"
      },
      {
        name: "Kubernetes Up & Running (3rd Edition)",
        author: "Brendan Burns, Joe Beda, Kelsey Hightower",
        description: "Sách nhập môn K8s chuẩn mực nhất được viết bởi chính những kỹ sư sáng lập ra dự án Kubernetes.",
        link: "https://www.oreilly.com/library/view/kubernetes-up-and/9781492043607/",
        badge: "K8s"
      },
      {
        name: "Accelerate: Building and Scaling High Performing Technology Organizations",
        author: "Nicole Forsgren, Jez Humble, Gene Kim",
        description: "Nghiên cứu khoa học về 4 chỉ số DORA Metrics và các thói quen kỹ thuật đem lại hiệu suất vượt trội.",
        link: "https://itrevolution.com/product/accelerate/",
        badge: "DORA Metrics"
      }
    ]
  },
  {
    title: "Interactive Labs & Môi trường thực hành Miễn phí",
    items: [
      {
        name: "Killercoda Interactive Scenarios",
        description: "Môi trường Kubernetes, Linux, Docker chạy trực tiếp trên trình duyệt miễn phí trong 60 phút, không cần cài đặt gì.",
        link: "https://killercoda.com/",
        badge: "Free Hands-on"
      },
      {
        name: "Play with Docker (PWD)",
        description: "Lab Docker tương tác miễn phí cung cấp cụm máy ảo Linux để thực hành Docker CLI và Swarm ngay lập tức.",
        link: "https://labs.play-with-docker.com/",
        badge: "Docker Lab"
      },
      {
        name: "K3s / Kind on Local VPS",
        description: "Tự tạo cụm Kubernetes nhẹ (K3s hoặc Kind) trên máy tính cá nhân hoặc 1 chiếc VPS 5$/tháng để làm chủ hoàn toàn hạ tầng.",
        link: "https://k3s.io/",
        badge: "Self-hosted"
      }
    ]
  }
];
