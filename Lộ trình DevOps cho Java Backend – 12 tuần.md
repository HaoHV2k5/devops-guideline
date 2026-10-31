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
- **Tuần 1: Linux System Deep-Dive & Quản lý Process JVM**
  - Quản lý process Linux: `ps`, `top -H -p <PID>`, `nice`, `kill` (SIGTERM vs SIGKILL).
  - Tự viết Systemd Service unit để auto-restart Spring Boot JAR và gom log qua `journalctl`.
  - Phân tích bộ nhớ Linux: Page Cache, Buffers, Available vs Free, Linux OOM Killer.
  - Bộ công cụ chuẩn đoán JVM trên Linux: `jps`, `jcmd`, `jstack`, `jmap`.
  - *Break & Debug:* Giả lập 1 Thread Java ngốn 100% CPU do infinite loop → lấy Thread ID bằng `top -H`, đổi sang Hex rồi tra `jstack` tìm chính xác dòng code gây nghẽn.
  - *Hỏi "Tại sao?":* Tại sao `free -m` báo ít RAM nhưng server vẫn ổn? Tại sao chạy `nohup java -jar &` bị xem là anti-pattern so với Systemd?

- **Tuần 2: Mạng máy tính & Reverse Proxy Nginx cho Backend**
  - TCP 3-way Handshake & 4-way Teardown; socket state `TIME_WAIT` và rò rỉ `CLOSE_WAIT`.
  - DNS resolution flow (`/etc/resolv.conf`, `dig +trace`).
  - TLS Handshake & Termination, cấp chứng chỉ tự động với Let's Encrypt Certbot.
  - Cấu hình Nginx Reverse Proxy trước Tomcat: upstream load balancing, gzip, rate limiting.
  - *Break & Debug:* Cố tình cấu hình Nginx timeout ngắn hơn thời gian xử lý của Spring Boot gây lỗi `504 Gateway Timeout`. Rò rỉ socket kẹt ở `CLOSE_WAIT`.
  - *Hỏi "Tại sao?":* Tại sao luôn đặt Nginx đứng trước Tomcat (TLS offloading, Slowloris protection, buffering)? Tại sao lỗi `CLOSE_WAIT` là do code Java chứ không phải Nginx?

---

### Phase 2: Containerization & CI/CD Pipeline (Tuần 3 – 5)
- **Tuần 3: Docker & Containerization chuẩn Production cho Java**
  - Linux Namespaces & cgroups v1/v2; OverlayFS layers.
  - Multi-stage Dockerfile: Maven/Gradle builder tách biệt với JRE Distroless / Eclipse Temurin Alpine runtime.
  - JVM Container Awareness: `-XX:InitialRAMPercentage`, `-XX:MaxRAMPercentage`.
  - Bảo mật container: Chạy non-root user (`USER spring:spring`), bỏ shell trong image.
  - *Break & Debug:* Chạy container Spring Boot bị Linux cgroup OOM Killer bắn hạ (Exit 137) dù chưa xuất hiện `OutOfMemoryError` trong log Java.
  - *Hỏi "Tại sao?":* Tại sao phải copy `pom.xml` / `build.gradle` tải dependencies trước khi copy source code? Tại sao không dùng `openjdk:latest`?

- **Tuần 4: Docker Compose & Kiến trúc Multi-Service (Java + Postgres + Redis + Kafka)**
  - Docker Compose v2 spec: networks bridge nội bộ, named volumes.
  - Service dependencies nâng cao: `depends_on` với `condition: service_healthy`.
  - Tích hợp cụm microservices: Spring Boot + PostgreSQL + Redis + Apache Kafka (KRaft).
  - *Break & Debug:* Spring Boot crash loop do Postgres chưa kịp mở cổng nhận kết nối (`Connection refused` / `FlywayException`). Sửa bằng healthcheck `pg_isready`.
  - *Hỏi "Tại sao?":* Tại sao `localhost` bên trong container không trỏ về máy host hay database? Tại sao không dùng Compose cho Production lớn?

- **Tuần 5: Tự động hóa CI/CD với GitHub Actions**
  - Workflows, Events, Jobs, Steps, Runners.
  - Cache Maven `.m2` và Docker Buildx layer cache để rút ngắn thời gian pipeline từ 8 phút xuống < 1 phút.
  - Automated Quality Gate: JUnit 5, Testcontainers, JaCoCo code coverage, SonarQube scan.
  - Build multi-arch image (amd64/arm64) và push vào GitHub Container Registry (GHCR).
  - *Break & Debug:* Pipeline nghẽn 15 phút do không cache, và lỗi 403 Forbidden khi push Docker image do thiếu quyền `packages: write`.
  - *Hỏi "Tại sao?":* Tại sao nguyên tắc cốt lõi là "Build Once, Deploy Everywhere"? Khi nào dùng Self-hosted Runner?

---

### Phase 3: Cloud & Kubernetes Orchestration (Tuần 6 – 9)
- **Tuần 6: Nền tảng Cloud (AWS) & Hạ tầng dạng mã (Terraform)**
  - VPC Topology: Public Subnet (ALB, NAT GW) và Private Subnet (Backend EC2, RDS PostgreSQL).
  - Stateful Security Groups vs Stateless Network ACLs.
  - Terraform HCL: Resources, Variables, Outputs, Remote Backend S3 + DynamoDB State Locking.
  - *Break & Debug:* EC2 không kết nối được RDS do cấu hình Security Group thiếu Inbound rule. Xử lý State Drift khi có người can thiệp thủ công trên AWS Console.
  - *Hỏi "Tại sao?":* Tại sao file `terraform.tfstate` không bao giờ được commit lên Git? Khác biệt giữa Security Group và NACL?

- **Tuần 7: Kubernetes Nền tảng: Kiến trúc, Pods, Deployments & Services**
  - Control Plane (API Server, etcd, Scheduler, Controller Manager) vs Worker Node (Kubelet, Kube-proxy).
  - Pod lifecycle: Pending, Running, CrashLoopBackOff, ImagePullBackOff.
  - Deployment & ReplicaSet; chiến lược Rolling Update (`maxSurge`, `maxUnavailable`).
  - Services (ClusterIP, NodePort, LoadBalancer) và CoreDNS internal resolution.
  - *Break & Debug:* Chẩn đoán Pod kẹt `CrashLoopBackOff` và `ImagePullBackOff` bằng `kubectl describe pod` và `kubectl logs --previous`.
  - *Hỏi "Tại sao?":* Tại sao không bao giờ chạy Pod độc lập trên Production? Làm sao Service định tuyến ổn định khi Pod IP liên tục đổi?

- **Tuần 8: Kubernetes Nâng cao: Config, Storage & Probes cho Spring Boot**
  - Tách biệt cấu hình: ConfigMap và Secret (bảo vệ at rest).
  - Persistent Volumes (PV), PVC và StorageClass.
  - Bộ ba Probes: `startupProbe`, `livenessProbe` và `readinessProbe` tích hợp Spring Boot Actuator.
  - Resource Requests & Limits; QoS Classes (Guaranteed vs Burstable).
  - *Break & Debug:* Kubelet giết Pod Spring Boot liên tục vì cấu hình livenessProbe quá vội vàng khi Spring context chưa nạp xong beans.
  - *Hỏi "Tại sao?":* Khác biệt sống còn giữa LivenessProbe và ReadinessProbe? Tại sao nên cấu hình Guaranteed QoS cho Java container?

- **Tuần 9: Quản lý gói Helm & Triển khai GitOps với ArgoCD**
  - Helm Charts: `values.yaml`, templates, release lifecycle (`install`, `upgrade`, `rollback`).
  - GitOps: Git là Single Source of Truth duy nhất; ArgoCD architecture (Pull model).
  - Tự động phát hiện OutOfSync và cơ chế Self-Healing.
  - *Break & Debug:* Sửa thủ công manifest trên cluster bằng `kubectl edit` và quan sát ArgoCD Self-Heal lập tức khôi phục về trạng thái trong Git.
  - *Hỏi "Tại sao?":* Tại sao Pull-based GitOps an toàn hơn Push-based CI/CD? Tại sao nên dùng generic Helm chart cho các service Spring Boot?

---

### Phase 4: Observability, Security & Capstone (Tuần 10 – 12)
- **Tuần 10: Giám sát & Khả năng quan sát (Prometheus, Grafana, Micrometer & Loki)**
  - 3 trụ cột Observability: Metrics, Centralized Logs, Distributed Traces.
  - Spring Boot Actuator + Micrometer xuất định dạng `/actuator/prometheus`.
  - PromQL thực chiến: Tính rate request, đếm lỗi 5xx, tính phân vị P95/P99 latency.
  - Thu thập log bằng Promtail/FluentBit, lưu trữ trên Grafana Loki.
  - *Break & Debug:* Phát hiện cạn kiệt HikariCP Connection Pool khi chịu tải và viết alert rule bắn thông báo về Slack/Telegram.
  - *Hỏi "Tại sao?":* Tại sao Average Latency là chỉ số gây hiểu lầm tai hại và bắt buộc phải dùng P95/P99? Tại sao Prometheus chọn mô hình Pull?

- **Tuần 11: DevSecOps: Bảo mật Hạ tầng & Quản lý Bí mật**
  - Shift-Left Security: Quét CVE Docker image với Trivy trong CI pipeline.
  - Pod Security Standards: `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, drop capabilities.
  - NetworkPolicies: Thiết lập tường lửa nội bộ giữa các Pods (Default Deny Ingress).
  - External Secrets Operator: Đồng bộ secret từ AWS Secrets Manager / Vault vào K8s Secret an toàn.
  - *Break & Debug:* Chặn đứng container chạy quyền root và quét phát hiện CVE nghiêm trọng trong base image.
  - *Hỏi "Tại sao?":* Tại sao Base64 không phải là mã hóa? Tại sao mạng K8s mặc định là phẳng (flat network) và nguy hiểm thế nào?

- **Tuần 12: Dự án Tốt nghiệp: Production Readiness, Zero-Downtime & Phỏng vấn**
  - Triển khai toàn diện: Spring Boot Microservices + PostgreSQL + Redis + Kafka lên Kubernetes bằng Helm & ArgoCD.
  - Horizontal Pod Autoscaler (HPA) tự động scale theo CPU/Memory.
  - Zero-downtime Rolling Update: Phối hợp K8s preStop hook (`sleep 5`) và Spring Boot `server.shutdown=graceful`.
  - Bắn tải 1000 req/s bằng k6 để kiểm tra không bị drop request (tránh lỗi 502 Bad Gateway).
  - Tổng kết 20 câu hỏi phỏng vấn "Tại sao?" thực chiến.
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
