BUILD_DATE?=$(shell date -u +'%Y-%m-%dT%H:%M:%SZ')
GIT_VERSION?=$(shell git describe --tags --dirty --abbrev=0 2>/dev/null || git symbolic-ref --short HEAD)
GIT_COMMIT?=$(shell git rev-parse HEAD 2>/dev/null)
GIT_BRANCH?=$(shell git symbolic-ref --short HEAD 2>/dev/null)
VERSION?=$(shell echo "${GIT_VERSION}" | sed -e 's/^v//')

BIN_DIR?=dist
IMAGE_REGISTRY?=registry.cn-hangzhou.aliyuncs.com
IMAGE_REPOSITORY?=xiaoshiai
IMAGE_NAME?=rune-docs


build:
	yarn install
	BUILD_DATE=${BUILD_DATE} \
	GIT_VERSION=${GIT_VERSION} \
	GIT_COMMIT=${GIT_COMMIT} \
	GIT_BRANCH=${GIT_BRANCH} \
	yarn build --mode production

FULL_IMAGE_NAME?=$(IMAGE_REGISTRY)/$(IMAGE_REPOSITORY)/$(IMAGE_NAME):$(GIT_VERSION)
BUILDX_PLATFORMS?=linux/amd64,linux/arm64
release-image:
	docker buildx build --platform=${BUILDX_PLATFORMS} --push -t ${FULL_IMAGE_NAME} -f Dockerfile .

release: release-image

clean:
	rm -rf $(BIN_DIR)