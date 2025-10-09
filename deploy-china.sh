#!/bin/bash

# 中国大陆网络优化版部署脚本
echo "🐾 Pet Memorial Website Deployment (China Optimized)"
echo "=================================================="

# 配置
CONTAINER_NAME="pet-memorial"
IMAGE_NAME="pet-memorial:latest"

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 检查网络连接
check_network() {
    print_step "检查网络连接..."

    if ping -c 1 registry.cn-hangzhou.aliyuncs.com >/dev/null 2>&1; then
        print_success "阿里云镜像源连接正常"
        USE_CHINA_MIRROR=true
    elif ping -c 1 registry-1.docker.io >/dev/null 2>&1; then
        print_warning "使用Docker Hub官方源（可能较慢）"
        USE_CHINA_MIRROR=false
    else
        print_error "网络连接有问题，请检查网络设置"
        exit 1
    fi
}

# 配置Docker镜像源
setup_docker_mirrors() {
    print_step "配置Docker镜像源..."

    # 创建Docker daemon配置目录
    sudo mkdir -p /etc/docker

    # 配置国内镜像源
    sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
    "registry-mirrors": [
        "https://registry.cn-hangzhou.aliyuncs.com",
        "https://hub-mirror.c.163.com",
        "https://mirror.baidubce.com"
    ],
    "max-concurrent-downloads": 3,
    "max-concurrent-uploads": 3,
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    }
}
EOF

    # 重启Docker服务
    print_step "重启Docker服务..."
    sudo systemctl daemon-reload
    sudo systemctl restart docker

    # 等待Docker服务启动
    sleep 5

    print_success "Docker镜像源配置完成"
}

# 检查SSL证书
check_ssl() {
    print_step "检查SSL证书..."

    if [ ! -f "key/cert.pem" ] || [ ! -f "key/key.pem" ]; then
        print_warning "未找到SSL证书，生成自签名证书..."
        mkdir -p key
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout key/key.pem \
            -out key/cert.pem \
            -subj "/C=CN/ST=Beijing/L=Beijing/O=Pet Memorial/CN=pet.xiudoule.com"
        print_success "自签名证书生成完成"
    else
        print_success "SSL证书已存在"
    fi
}

# 清理现有容器
cleanup() {
    print_step "清理现有容器..."

    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker stop $CONTAINER_NAME >/dev/null 2>&1
    fi

    if docker ps -aq -f name=$CONTAINER_NAME | grep -q .; then
        docker rm $CONTAINER_NAME >/dev/null 2>&1
    fi

    # 清理旧镜像
    if docker images -q $IMAGE_NAME | grep -q .; then
        docker rmi $IMAGE_NAME >/dev/null 2>&1 || true
    fi

    print_success "清理完成"
}

# 构建镜像
build_image() {
    print_step "构建Docker镜像..."

    # 选择合适的Dockerfile
    if [ "$USE_CHINA_MIRROR" = true ]; then
        DOCKERFILE="docker/Dockerfile.china"
        print_step "使用中国镜像源优化的Dockerfile"
    else
        DOCKERFILE="docker/Dockerfile.simple"
        print_step "使用简化版Dockerfile"
    fi

    # 设置构建参数
    export DOCKER_BUILDKIT=0
    export COMPOSE_DOCKER_CLI_BUILD=0

    # 构建镜像（增加超时时间）
    timeout 1800 docker build --no-cache --network=host -f $DOCKERFILE -t $IMAGE_NAME . || {
        print_error "镜像构建失败"
        print_error "可能的解决方案："
        print_error "1. 检查网络连接"
        print_error "2. 运行: sudo systemctl restart docker"
        print_error "3. 清理Docker缓存: docker system prune -a"
        exit 1
    }

    print_success "镜像构建成功"
}

# 部署容器
deploy() {
    print_step "部署容器..."

    # 创建必要目录
    mkdir -p uploads data
    chmod 755 uploads

    # 启动容器
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        --memory="512m" \
        --cpus="1.0" \
        -p 80:80 \
        -p 443:443 \
        -v "$(pwd)/key/cert.pem:/etc/nginx/ssl/cert.pem:ro" \
        -v "$(pwd)/key/key.pem:/etc/nginx/ssl/key.pem:ro" \
        -v "$(pwd)/uploads:/usr/share/nginx/html/uploads" \
        -v "$(pwd)/data:/app/data" \
        $IMAGE_NAME || {
        print_error "容器启动失败"
        print_error "查看日志: docker logs $CONTAINER_NAME"
        exit 1
    }

    print_success "容器启动成功"
}

# 健康检查
health_check() {
    print_step "进行健康检查..."

    sleep 10

    if ! docker ps | grep -q $CONTAINER_NAME; then
        print_error "容器未正常运行"
        print_error "容器日志："
        docker logs $CONTAINER_NAME
        exit 1
    fi

    # 检查HTTP服务
    if curl -f http://localhost:80 >/dev/null 2>&1; then
        print_success "HTTP服务正常"
    else
        print_warning "HTTP服务可能有问题"
    fi

    print_success "健康检查通过"
}

# 显示部署信息
show_info() {
    print_success "=== 部署完成 ==="
    echo ""
    echo "🌐 网站地址: https://pet.xiudoule.com"
    echo "🐳 容器名称: $CONTAINER_NAME"
    echo "📊 容器状态:"
    docker ps | grep $CONTAINER_NAME
    echo ""
    echo "🔧 常用命令:"
    echo "  查看日志: docker logs $CONTAINER_NAME -f"
    echo "  重启容器: docker restart $CONTAINER_NAME"
    echo "  停止容器: docker stop $CONTAINER_NAME"
    echo ""
    echo "📝 注意事项:"
    echo "  • 确保域名DNS指向本服务器"
    echo "  • 生产环境请使用真实SSL证书"
    echo "  • 开放防火墙80和443端口"
}

# 主函数
main() {
    check_network

    # 如果是首次运行且网络环境需要，配置镜像源
    if [ "$USE_CHINA_MIRROR" = true ] && [ ! -f "/etc/docker/daemon.json" ]; then
        setup_docker_mirrors
    fi

    check_ssl
    cleanup
    build_image
    deploy
    health_check
    show_info
}

# 错误处理
set -e
trap 'print_error "部署过程中发生错误，请检查上面的错误信息"; exit 1' ERR

# 运行主函数
main "$@"