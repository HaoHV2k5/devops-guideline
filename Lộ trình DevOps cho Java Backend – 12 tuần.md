# Lộ trình DevOps cho Java Backend (12 tuần)

> **Mục tiêu:** 12 tuần · khoảng 1,5–2 giờ/ngày · từ “làm được” sang “hiểu vì sao” để tự tin phỏng vấn.

---

## Cách học để hiểu sâu

- **Quy tắc cốt lõi:** Đọc → Tự làm → **Cố tình làm hỏng** → Debug → Ghi lại. Hiểu sâu thực sự nằm ở bước debug.
- **Luyện phỏng vấn:** Mỗi tuần trả lời được các câu “Tại sao?” ở cuối phần, nói thành lời không nhìn tài liệu.
- **Thực hành:** Dùng chính server riêng (VPS/Cloud) và dự án backend Java Spring Boot bạn đang có làm môi trường thực hành, ghi lại thành README / sơ đồ kiến trúc.

---

## 4 Giai đoạn phát triển (Phases)

### Phase 1: Nền tảng Hệ thống & Mạng (Tuần 1 – 2)

#### Tuần 1: Linux System Deep-Dive & Quản lý Process JVM
- **Linux File Hierarchy (FHS) & Phân quyền User/Group:** Nắm vững các thư mục quan trọng `/etc` (chứa cấu hình), `/var/log` (chứa log), `/opt` (chứa JAR app). Thực hành lệnh `chmod 750/640`, `chown` tạo user riêng `devops/spring` không có quyền root để chạy app an toàn.
- **Systemd Service Unit cho Spring Boot:** Tự viết file cấu hình `/etc/systemd/system/myapp.service` với các tham số `ExecStart=java -jar ...`, `Restart=always`, `RestartSec=10s`. Kích hoạt auto-restart cùng OS bằng `systemctl enable --now` và quản lý log qua `journalctl`.
- **Vòng đời Process, Quản lý Thread & Signals:** Hiểu cách Linux quản lý PID và LWP (Light Weight Process). Phân biệt signal `SIGTERM (15)` để ứng dụng giải phóng tài nguyên êm đẹp (Graceful Shutdown) và `SIGKILL (9)` ép tắt tiến trình.
- **Bộ nhớ Linux: Free, Available & Page Cache:** Đọc hiểu đúng đầu ra của lệnh `free -h`. Biết cách Linux Kernel tận dụng RAM rảnh làm Page Cache/Buffers và hiểu cơ chế Kernel kích hoạt OOM Killer khi thiếu hụt bộ nhớ.
- **Bộ công cụ dòng lệnh chuẩn đoán JVM trên Linux:** Thực hành sử dụng các công cụ đi kèm JDK: `jps -l` (tìm PID Java), `jcmd <PID> VM.flags` (xem flags runtime), `jstack <PID>` (xuất thread dump khi CPU spike), `jstat -gc` (soi Garbage Collection).
- *Break & Debug:* Giả lập 1 Thread Java ngốn 100% CPU do infinite loop → lấy Thread ID bằng `top -H`, đổi sang Hex rồi tra `jstack` tìm chính xác dòng code gây nghẽn.
- *Hỏi "Tại sao?":* Tại sao `free -m` báo ít RAM nhưng server vẫn ổn? Tại sao chạy `nohup java -jar &` bị xem là anti-pattern so với Systemd?

#### Tuần 2: Mạng máy tính & Reverse Proxy Nginx cho Backend
- **TCP 3-way Handshake & 4-way Teardown:** Nắm vững quy trình thiết lập kết nối TCP (SYN, SYN-ACK, ACK) và kết thúc (FIN, ACK). Phân biệt trạng thái `TIME_WAIT` (phía chủ động đóng) và hiện tượng rò rỉ socket `CLOSE_WAIT` do code Java không gọi `close()`.
- **Cơ chế phân giải tên miền DNS & Caching:** Nắm rõ chu trình phân giải từ `/etc/hosts` → Local DNS Cache → `/etc/resolv.conf` → Recursive DNS Resolver. Sử dụng lệnh `dig +trace` và `nslookup` để bắt lỗi khi không gọi được 3rd-party API.
- **Giao thức HTTP/1.1 Keep-Alive, HTTP/2 & HTTP/3 QUIC:** So sánh cơ chế Multiplexing trong HTTP/2 (giảm độ trễ nhiều requests qua 1 kết nối TCP duy nhất) và HTTP/3 qua giao thức UDP. Cấu hình Connection Pool cho HttpClient trong Spring Boot.
- **Bảo mật SSL/TLS Handshake & Cấp chứng chỉ Certbot:** Hiểu cách thức mã hóa bất đối xứng để trao đổi session key đối xứng. Tự động cấp và gia hạn chứng chỉ Let's Encrypt cho domain bằng công cụ `certbot --nginx`.
- **Nginx Reverse Proxy, Load Balancing & Bảo vệ Tomcat:** Thiết lập Nginx đứng trước Embedded Tomcat để TLS termination, chia tải Upstream (round-robin, ip_hash), cấu hình rate limiting, gzip nén dữ liệu và forward đúng header `X-Forwarded-For`.
- *Break & Debug:* Cố tình cấu hình Nginx timeout ngắn hơn thời gian xử lý của Spring Boot gây lỗi `504 Gateway Timeout`. Rò rỉ socket kẹt ở `CLOSE_WAIT`.
- *Hỏi "Tại sao?":* Tại sao luôn đặt Nginx đứng trước Tomcat (TLS offloading, Slowloris protection, buffering)? Tại sao lỗi `CLOSE_WAIT` là do code Java chứ không phải Nginx?

---

### Phase 2: Containerization & CI/CD Pipeline (Tuần 3 – 5)

#### Tuần 3: Docker & Containerization chuẩn Production cho Java
- **Bản chất Container: Linux Namespaces & cgroups v2:** Thấu hiểu container không phải là máy ảo mà là tiến trình Linux bị cô lập bằng Namespaces (PID, NET, MNT) và bị giới hạn tài nguyên bởi Control Groups (cgroups limit CPU, RAM).
- **Cơ chế Image Layering, Build Cache & OverlayFS:** Hiểu nguyên lý xếp chồng layer và tính chất Copy-on-Write. Sắp xếp thứ tự các lệnh trong Dockerfile sao cho tầng ít thay đổi (dependencies) đứng trước để tận dụng tối đa cache.
- **Multi-stage Dockerfile tối ưu kích thước image:** Tách biệt 2 stage: Stage build dùng Maven/Gradle với OpenJDK để compile code, Stage runtime dùng JRE Distroless hoặc Eclipse Temurin Alpine chỉ ~150MB, loại bỏ hoàn toàn compiler thừa.
- **JVM Container Awareness & Bộ nhớ trong Container:** Cấu hình `-XX:MaxRAMPercentage=75.0` để JVM đọc đúng dung lượng RAM giới hạn từ cgroups, chừa 25% cho native memory, thread stacks và OS buffers, tránh bị Linux OOM Killer bắn hạ (Exit 137).
- **Bảo mật Container: Chạy với Non-root User:** Khai báo user không đặc quyền `USER 1001:1001` trong Dockerfile. Không chạy container với quyền root, loại bỏ shell và các tiện ích nhạy cảm như `curl`, `wget` trong production image.
- *Break & Debug:* Chạy container Spring Boot bị Linux cgroup OOM Killer bắn hạ (Exit 137) dù chưa xuất hiện `OutOfMemoryError` trong log Java.
- *Hỏi "Tại sao?":* Tại sao phải copy `pom.xml` / `build.gradle` tải dependencies trước khi copy source code? Tại sao không dùng `openjdk:latest`?

#### Tuần 4: Docker Compose & Kiến trúc Multi-Service Backend
- **Docker Compose v2: Khai báo hạ tầng dịch vụ đồng nhất:** Viết file `docker-compose.yml` chuẩn hóa định nghĩa toàn bộ cụm dịch vụ Backend, Database, Cache và Message Queue chạy đồng bộ chỉ bằng 1 câu lệnh `docker compose up -d`.
- **Mạng nội bộ User-defined Bridge & Phân giải DNS tự động:** Hiểu cách Docker Compose tạo mạng bridge riêng và tự động phân giải tên service (như `postgres`, `redis`, `kafka`) thành IP nội bộ, loại bỏ việc hardcode IP hay dùng localhost.
- **Lưu trữ dữ liệu bền vững: Bind Mounts vs Named Volumes:** Phân biệt Bind Mount (mount thư mục trên máy host, phù hợp dev) và Named Volume (do Docker engine quản lý, tối ưu I/O, dùng cho database production để không mất dữ liệu khi xóa container).
- **Kiểm soát thứ tự khởi động với Service Healthcheck:** Giải quyết bài toán Spring Boot crash do DB chưa sẵn sàng bằng cách khai báo `healthcheck` với `pg_isready` trong PostgreSQL và `depends_on: { postgres: { condition: service_healthy } }`.
- **Tích hợp cụm Full-stack: Spring Boot + Postgres + Redis + Kafka:** Cấu hình tích hợp môi trường hoàn chỉnh gồm Spring Boot REST API, cơ sở dữ liệu PostgreSQL, Redis làm distributed cache, và cụm Apache Kafka (chạy chế độ KRaft không cần Zookeeper) kèm giao diện Kafdrop.
- *Break & Debug:* Spring Boot crash loop do Postgres chưa kịp mở cổng nhận kết nối (`Connection refused` / `FlywayException`). Sửa bằng healthcheck `pg_isready`.
- *Hỏi "Tại sao?":* Tại sao `localhost` bên trong container không trỏ về máy host hay database? Tại sao không dùng Compose cho Production lớn?

#### Tuần 5: Tự động hóa CI/CD với GitHub Actions
- **Kiến trúc GitHub Actions: Workflows, Jobs, Steps & Runners:** Hiểu cách thức hoạt động của runner (máy ảo Linux tạm thời), cấu trúc file YAML `.github/workflows/ci.yml`, các sự kiện trigger (push, pull_request) và cơ chế phân nhánh jobs.
- **Tối ưu hóa tốc độ build bằng Dependency & Layer Caching:** Cấu hình `actions/cache` lưu trữ thư mục `~/.m2` hoặc Gradle cache và sử dụng Docker Buildx GitHub cache (`type=gha`) để rút ngắn thời gian pipeline từ 8 phút xuống còn dưới 60 giây.
- **Automated Quality Gate: Unit Test, Testcontainers & JaCoCo:** Tự động chạy bộ test JUnit 5, tích hợp Testcontainers để test database thực tế trong pipeline, xuất báo cáo độ phủ mã nguồn JaCoCo và chặn merge PR nếu test thất bại hoặc code coverage < 80%.
- **Quét chất lượng mã nguồn & Lỗ hổng bảo mật tự động:** Tích hợp SonarCloud/SonarQube để phát hiện code smells, bug tiềm ẩn và lỗ hổng bảo mật. Sử dụng Trivy quét dependency Maven để phát hiện các CVE nghiêm trọng trước khi build image.
- **Đóng gói Docker Multi-arch & Đẩy lên GitHub Container Registry (GHCR):** Sử dụng `docker/build-push-action` build image hỗ trợ cả kiến trúc `linux/amd64` và `linux/arm64`, gán tag theo Git Commit SHA và push an toàn lên GHCR bằng `GITHUB_TOKEN`.
- *Break & Debug:* Pipeline nghẽn 15 phút do không cache, và lỗi 403 Forbidden khi push Docker image do thiếu quyền `packages: write`.
- *Hỏi "Tại sao?":* Tại sao nguyên tắc cốt lõi là "Build Once, Deploy Everywhere"? Khi nào dùng Self-hosted Runner?

---

### Phase 3: Cloud & Kubernetes Orchestration (Tuần 6 – 9)

#### Tuần 6: Nền tảng Cloud (AWS) & Hạ tầng dạng mã (Terraform)
- **Thiết kế kiến trúc Cloud VPC & Phân vùng Subnets chuẩn:** Thiết kế mạng ảo VPC trên AWS chia thành Public Subnet (chứa NAT Gateway, Application Load Balancer) và Private Subnet cô lập (chứa máy chủ EC2 backend và cơ sở dữ liệu RDS).
- **Bảo mật mạng nhiều lớp: Security Groups vs Network ACLs:** Phân biệt Security Group hoạt động ở tầng instance (Stateful - tự cho phép phản hồi) và NACL hoạt động ở tầng subnet (Stateless - phải mở cả 2 chiều). Cấu hình chỉ cho phép EC2 gọi port 5432 của RDS.
- **Ngôn ngữ HCL của Terraform: Providers, Resources & Variables:** Khai báo hạ tầng bằng code thay vì bấm tay trên AWS Console. Nắm vững cú pháp HCL, cách truyền biến qua `variables.tf`, xuất giá trị qua `outputs.tf` và quản lý dependencies giữa các tài nguyên.
- **Quản lý State an toàn: S3 Remote Backend & DynamoDB Locking:** Lưu file `terraform.tfstate` tập trung trên AWS S3 Bucket (mã hóa at-rest) kết hợp bảng DynamoDB để khóa state (State Locking), ngăn chặn xung đột dữ liệu khi nhiều kỹ sư cùng chạy apply.
- **Quy trình vận hành Terraform an toàn: Plan & Apply:** Luôn chạy `terraform plan -out=tfplan` để rà soát chi tiết mọi tài nguyên sắp được tạo/sửa/xóa trước khi áp dụng thực tế, sử dụng `terraform fmt` và `tflint` để chuẩn hóa code.
- *Break & Debug:* EC2 không kết nối được RDS do cấu hình Security Group thiếu Inbound rule. Xử lý State Drift khi có người can thiệp thủ công trên AWS Console.
- *Hỏi "Tại sao?":* Tại sao file `terraform.tfstate` không bao giờ được commit lên Git? Khác biệt giữa Security Group và NACL?

#### Tuần 7: Kubernetes Nền tảng: Kiến trúc, Pods, Deployments & Services
- **Kiến trúc K8s: Control Plane vs Worker Nodes:** Nắm vững nhiệm vụ của các thành phần Control Plane (API Server, cơ sở dữ liệu etcd, Scheduler, Controller Manager) và Worker Node (Kubelet quản lý Pod, Kube-proxy định tuyến mạng, Containerd runtime).
- **Nguyên lý Vòng lặp hòa giải (Reconciliation Loop):** Hiểu cốt lõi triết lý Kubernetes: So sánh liên tục giữa Trạng thái mong muốn (Desired State khai báo trong file YAML) và Trạng thái thực tế (Actual State trên cụm máy chủ) để tự động sửa đổi.
- **Vòng đời Pod & Các trạng thái sự cố kinh điển:** Nắm rõ chu trình sống của Pod từ `Pending` → `Running` → `Succeeded/Failed`. Phân tích bản chất nguyên nhân khi Pod bị rơi vào `CrashLoopBackOff` hoặc `ImagePullBackOff`.
- **Deployment Controller & Chiến lược Rolling Update:** Quản lý ReplicaSet để đảm bảo số lượng bản sao mong muốn. Cấu hình chiến lược cập nhật cuốn chiếu Rolling Update (`maxSurge`, `maxUnavailable`) để deploy phiên bản mới không gián đoạn dịch vụ.
- **Kubernetes Services & Phân giải tên miền CoreDNS:** Bản chất Service: Cung cấp IP ảo ổn định (ClusterIP, NodePort, LoadBalancer) đại diện cho một nhóm Pod thay đổi liên tục. Cơ chế CoreDNS nội bộ tự động phân giải `servicename.namespace.svc.cluster.local`.
- *Break & Debug:* Chẩn đoán Pod kẹt `CrashLoopBackOff` và `ImagePullBackOff` bằng `kubectl describe pod` và `kubectl logs --previous`.
- *Hỏi "Tại sao?":* Tại sao không bao giờ chạy Pod độc lập trên Production? Làm sao Service định tuyến ổn định khi Pod IP liên tục đổi?

#### Tuần 8: Kubernetes Nâng cao: Config, Storage & Probes cho Spring Boot
- **Tách biệt cấu hình: ConfigMap & Secret:** Quản lý tham số môi trường và mật khẩu độc lập với container image. Mount ConfigMap và Secret dưới dạng biến môi trường (`envFrom`) hoặc file cấu hình mount vào thư mục (`volumeMounts`).
- **Lưu trữ dữ liệu bền vững: PV, PVC & StorageClass:** Hiểu cách thức trừu tượng hóa ổ cứng lưu trữ trong K8s: PersistentVolume (ổ cứng do admin cấp), PersistentVolumeClaim (yêu cầu cấp phát của ứng dụng) và Dynamic Provisioning tự động tạo volume qua StorageClass.
- **Bộ 3 Healthcheck Probes: Startup, Liveness & Readiness:** Tích hợp Spring Boot Actuator (`/actuator/health/liveness` và `/readiness`). Cấu hình `startupProbe` bảo vệ ứng dụng Java khởi động chậm, `livenessProbe` khởi động lại Pod khi deadlock, `readinessProbe` tạm gỡ traffic khi app bận.
- **Phân bổ tài nguyên: Resource Requests & Limits:** Khai báo `requests` để K8s Scheduler tìm node có đủ CPU/RAM và `limits` để chặn app ngốn tài nguyên vượt mức. Hiểu hiện tượng CPU Throttling và Linux OOMKilled exit code 137 khi vượt RAM limit.
- **Phân loại chất lượng dịch vụ: Kubernetes QoS Classes:** Phân biệt 3 nhóm QoS: `Guaranteed` (request = limit), `Burstable` (request < limit) và `BestEffort` (không khai báo). Hiểu thứ tự ưu tiên mà Kubelet chọn để trục xuất (evict) Pod khi node cạn kiệt tài nguyên.
- *Break & Debug:* Kubelet giết Pod Spring Boot liên tục vì cấu hình livenessProbe quá vội vàng khi Spring context chưa nạp xong beans.
- *Hỏi "Tại sao?":* Khác biệt sống còn giữa LivenessProbe và ReadinessProbe? Tại sao nên cấu hình Guaranteed QoS cho Java container?

#### Tuần 9: Quản lý gói Helm & Triển khai GitOps với ArgoCD
- **Giải quyết vấn đề YAML Hell bằng Helm Package Manager:** Hiểu tại sao copy-paste file YAML thủ công gây lỗi khi triển khai đa môi trường. Nắm cấu trúc Helm Chart (`Chart.yaml`, `values.yaml`, templates) và các biến built-in `.Values`, `.Release`.
- **Tạo Generic Helm Chart dùng chung cho Microservices Spring Boot:** Xây dựng 1 Chart mẫu chuẩn hóa cho công ty: Định nghĩa Deployment, Service, Ingress, HPA và Actuator Probes, chỉ cần ghi đè file `values-dev.yaml` và `values-prod.yaml` cho từng service.
- **Kiểm thử & Vòng đời bản phát hành Helm:** Sử dụng `helm template` và `helm lint` để kiểm tra cú pháp YAML đã render trước khi triển khai. Nắm vững lệnh `helm upgrade --install` và rollback tức thì bằng `helm rollback <release> <revision>`.
- **Triết lý GitOps: Git là Single Source of Truth duy nhất:** Toàn bộ trạng thái hạ tầng được khai báo và lưu trữ trên Git repository. Mọi thay đổi trên cluster bắt buộc phải thông qua Git Commit và Pull Request để có lịch sử audit log minh bạch 100%.
- **Kiến trúc ArgoCD: Tự động đồng bộ & Cơ chế Self-Healing:** Cài đặt ArgoCD trên cluster theo mô hình Pull-based an toàn. Khai báo đối tượng `Application` CRD, cấu hình Auto-sync và bật `selfHeal: true` để tự động đè lại cấu hình nếu có ai sửa bằng tay trên cluster.
- *Break & Debug:* Sửa thủ công manifest trên cluster bằng `kubectl edit` và quan sát ArgoCD Self-Heal lập tức khôi phục về trạng thái trong Git.
- *Hỏi "Tại sao?":* Tại sao Pull-based GitOps an toàn hơn Push-based CI/CD? Tại sao nên dùng generic Helm chart cho các service Spring Boot?

---

### Phase 4: Observability, Security & Capstone (Tuần 10 – 12)

#### Tuần 10: Giám sát & Khả năng quan sát (Prometheus, Grafana, Micrometer & Loki)
- **3 Trụ cột Observability: Metrics, Centralized Logs & Traces:** Hiểu vai trò từng trụ cột: Metrics trả lời "hệ thống đang gặp vấn đề ở đâu?", Logs cho biết "chi tiết sự cố là gì?", và Distributed Traces giúp "lần theo hành trình request qua các microservices".
- **Spring Boot Actuator kết hợp Micrometer xuất Metrics chuẩn:** Bật endpoint `/actuator/prometheus` trong Spring Boot. Thu thập các chỉ số quan trọng: JVM memory (heap/non-heap), Garbage Collection pause times, HikariCP connection pool, và HTTP request count/latency.
- **Prometheus Architecture: Mô hình Pull, TSDB & Scrape Configs:** Hiểu lý do Prometheus chọn mô hình Pull để kiểm soát tải không bị DDoS. Cấu hình `scrape_configs` hoặc Prometheus Operator ServiceMonitor để tự động phát hiện các Pod backend mới tạo.
- **Truy vấn PromQL thực chiến: Rate, Sum & Phân vị P95/P99:** Viết câu lệnh PromQL tính số request lỗi 5xx trên giây (`sum(rate(...[5m]))`), và tính thời gian phản hồi ở phân vị P95/P99 bằng `histogram_quantile` thay vì dùng thời gian trung bình sai lệch.
- **Centralized Logging với Grafana Loki & Thiết lập Alerts:** Gom log từ container bằng Promtail/FluentBit đẩy về Loki, xem log trực tiếp trên Grafana bằng cú pháp LogQL. Thiết lập Alertmanager gửi thông báo khẩn cấp về Slack/Telegram khi hệ thống có lỗi đột biến.
- *Break & Debug:* Phát hiện cạn kiệt HikariCP Connection Pool khi chịu tải và viết alert rule bắn thông báo về Slack/Telegram.
- *Hỏi "Tại sao?":* Tại sao Average Latency là chỉ số gây hiểu lầm tai hại và bắt buộc phải dùng P95/P99? Tại sao Prometheus chọn mô hình Pull?

#### Tuần 11: DevSecOps: Bảo mật Hạ tầng & Quản lý Bí mật
- **Triết lý Shift-Left Security trong vòng đời phần mềm:** Đưa các bước kiểm tra an ninh vào giai đoạn sớm nhất của chu trình phát triển (lúc viết code và build time trong CI) thay vì đợi ứng dụng chạy trên Production mới phát hiện lỗ hổng.
- **Quét lỗ hổng tự động với Trivy trong CI Pipeline:** Tích hợp Trivy quét các CVE trong base image hệ điều hành và thư viện phụ thuộc Maven/Gradle. Cấu hình tự động dừng pipeline nếu phát hiện lỗ hổng mức độ `HIGH` hoặc `CRITICAL`.
- **Kubernetes Security Hardening & Pod Security Standards:** Thiết lập `securityContext` cho container: `readOnlyRootFilesystem: true` (ngăn ghi file trái phép), `runAsNonRoot: true`, `allowPrivilegeEscalation: false` và drop toàn bộ Linux capabilities không cần thiết.
- **Tường lửa mạng nội bộ với K8s NetworkPolicies:** Thay thế mô hình mạng phẳng mặc định bằng việc áp dụng NetworkPolicy với chính sách `Default Deny Ingress`. Chỉ cho phép Pod Backend kết nối vào port 5432 của Pod Database PostgreSQL.
- **Quản lý bí mật an toàn với External Secrets Operator & Vault:** Không bao giờ lưu secret mã hóa base64 trên Git. Sử dụng External Secrets Operator để tự động kéo secret từ AWS Secrets Manager hoặc HashiCorp Vault đồng bộ thành K8s Secret an toàn.
- *Break & Debug:* Chặn đứng container chạy quyền root và quét phát hiện CVE nghiêm trọng trong base image.
- *Hỏi "Tại sao?":* Tại sao Base64 không phải là mã hóa? Tại sao mạng K8s mặc định là phẳng (flat network) và nguy hiểm thế nào?

#### Tuần 12: Dự án Tốt nghiệp: Production Readiness, Zero-Downtime & Phỏng vấn
- **Kiến trúc Tổng thể Capstone Microservices Production:** Hoàn thiện kiến trúc khép kín: Client → Cloudflare DNS/WAF → Nginx Ingress Controller (TLS termination) → Spring Boot REST API (scale HPA) → PostgreSQL + Redis Cache + Apache Kafka.
- **Horizontal Pod Autoscaler (HPA) theo CPU, Memory & Custom Metrics:** Cài đặt K8s Metrics Server và cấu hình HPA tự động tăng giảm số lượng replica (từ 2 đến 10 Pods) dựa trên ngưỡng CPU (> 70%) hoặc lưu lượng request HTTP thực tế.
- **Bí quyết Zero-Downtime Deployment & Graceful Shutdown:** Phối hợp nhịp nhàng giữa Kubernetes Endpoints, `preStop` hook (`sleep 5`) và cấu hình `server.shutdown=graceful` trong Spring Boot để đảm bảo 0% request bị drop khi Rolling Update.
- **Kiểm thử tải & Diễn tập sự cố (Chaos Engineering):** Dùng k6 bắn tải 1000 req/s đồng thời tiến hành deploy phiên bản mới để kiểm tra độ ổn định. Tự tay xóa ngẫu nhiên 1 Pod hoặc giả lập mất mạng database để kiểm tra khả năng tự phục hồi.
- **Tổng hợp 20 kịch bản phỏng vấn "Tại sao?" & Báo cáo đồ án:** Ôn tập toàn diện bộ câu hỏi giải thích cơ chế sâu, tự nói thành lời trôi chảy từ kiến trúc hệ thống, quy trình CI/CD đến kinh nghiệm debug các lỗi production thực tế để tự tin chinh phục nhà tuyển dụng.
- *Hỏi "Tại sao?":* Mô tả chi tiết hành trình từ lúc `git push` đến khi tính năng xuất hiện trên Production? 4 chỉ số DORA Metrics là gì?

---

## Cheat sheet: Lệnh thường dùng

### 1. Linux & JVM
```bash
top -H -p $(pgrep -f java)                          # Soi từng thread con của JVM ngốn CPU
printf '%x\n' <TID>                                 # Chuyển Thread ID sang Hex
jstack <PID> | grep -A 20 <NID_HEX>                 # Tìm chính xác dòng code Java gây treo
jcmd <PID> VM.flags                                 # Xem toàn bộ JVM flags đang áp dụng
journalctl -u springboot-app.service -f -n 100      # Xem live log của systemd service
ss -tan | grep ':8080'                              # Đếm số socket TCP (TIME_WAIT, CLOSE_WAIT)
```

### 2. Docker & Container
```bash
docker run -d -p 8080:8080 -m 512m --cpus=1 my-app # Chạy container với giới hạn RAM/CPU
docker inspect <id> | grep -i oomkilled            # Kiểm tra xem có bị Linux OOM Killer bắn hạ
docker stats                                        # Xem bảng điều khiển CPU/RAM realtime
docker compose up -d --build                        # Build và chạy toàn bộ cụm services
docker compose down -v                              # Dừng và xóa cả named volumes
```

### 3. Kubernetes & Debugging
```bash
kubectl get pods -o wide --show-labels              # Xem pods kèm Node và Labels
kubectl describe pod <pod-name>                     # Soi Events của Kubelet
kubectl logs <pod-name> -c <container> --previous   # Xem log container ngay trước lần crash
kubectl exec -it <pod-name> -- /bin/sh              # Mở shell bên trong Pod
kubectl rollout undo deployment/<name>              # Rollback deployment ngay lập tức
kubectl port-forward svc/<name> 8080:8080           # Forward port test nhanh tại local
```

### 4. GitOps, Helm & Observability
```bash
helm template my-release ./chart -f values.yaml     # Render manifest YAML kiểm tra cú pháp
helm upgrade --install backend ./chart              # Cài đặt hoặc cập nhật Helm release
argocd app sync backend-app                         # Ép ArgoCD đồng bộ từ Git xuống cluster
trivy image --severity CRITICAL app:1.0             # Quét lỗ hổng nghiêm trọng trong image
promtool check config prometheus.yml                # Kiểm tra file cấu hình Prometheus
```

---

## Gợi ý tài liệu & Labs miễn phí

- **Tài liệu chính thức (Official Docs):**
  - [Docker Documentation](https://docs.docker.com/)
  - [Kubernetes Documentation](https://kubernetes.io/docs/)
  - [GitHub Actions Documentation](https://docs.github.com/en/actions)
  - [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
  - [Prometheus Documentation](https://prometheus.io/docs/)
  - [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- **Sách kinh điển:**
  - *The Phoenix Project* (Gene Kim) – Tư duy DevOps và luồng công việc tinh gọn.
  - *Site Reliability Engineering* (Google SRE Book) – Miễn phí online tại `sre.google/sre-book`.
  - *Kubernetes Up & Running* (Brendan Burns, Joe Beda, Kelsey Hightower).
  - *Accelerate* (Nicole Forsgren, Jez Humble, Gene Kim) – Khoa học về 4 chỉ số DORA Metrics.
- **Interactive Labs miễn phí:**
  - `killercoda.com`: Cung cấp môi trường Kubernetes, Linux, Docker chạy ngay trên trình duyệt 60 phút miễn phí.
  - `labs.play-with-docker.com`: Thực hành Docker đa node miễn phí.
  - `kind` / `k3s`: Cài đặt cụm K8s siêu nhẹ trên máy tính cá nhân hoặc VPS 5$/tháng.
