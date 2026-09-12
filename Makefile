BUILD_DATE?=$(shell date -u +'%Y-%m-%dT%H:%M:%SZ')
GIT_VERSION?=$(shell git describe --tags --dirty --abbrev=0 2>/dev/null || git symbolic-ref --short HEAD)
GIT_COMMIT?=$(shell git rev-parse HEAD 2>/dev/null)
GIT_BRANCH?=$(shell git symbolic-ref --short HEAD 2>/dev/null)
VERSION?=$(shell echo "${GIT_VERSION}" | sed -e 's/^v//')

BIN_DIR?=dist
IMAGE_REGISTRY?=registry.cn-hangzhou.aliyuncs.com
IMAGE_REPOSITORY?=xiaoshiai
IMAGE_NAME?=rune-docs

DOCS_BASE_URL?=/docs

build:
	yarn install
	VITE_BASE_URL=${DOCS_BASE_URL} \
	BUILD_DATE=${BUILD_DATE} \
	GIT_VERSION=${GIT_VERSION} \
	GIT_COMMIT=${GIT_COMMIT} \
	GIT_BRANCH=${GIT_BRANCH} \
	yarn build --mode production

FULL_IMAGE_NAME?=$(IMAGE_REGISTRY)/$(IMAGE_REPOSITORY)/$(IMAGE_NAME):$(GIT_VERSION)
ifeq ($(GIT_BRANCH), main)
	FULL_IMAGE_NAME=$(IMAGE_REGISTRY)/$(IMAGE_REPOSITORY)/$(IMAGE_NAME):latest
endif
BUILDX_PLATFORMS?=linux/amd64,linux/arm64
# 阿里云 ACR 不识别 buildx 默认生成的 OCI attestation（application/vnd.oci.empty.v1+json），
# 会导致 `--push` 报 denied: unknown manifest class，故显式关闭 provenance / sbom。
release-image:
	docker buildx build --platform=${BUILDX_PLATFORMS} --provenance=false --sbom=false --push -t ${FULL_IMAGE_NAME} -f Dockerfile .

package-helm:
	@mkdir -p ${BIN_DIR}/charts
	helm package --version ${VERSION} --app-version ${GIT_VERSION} --destination ${BIN_DIR}/charts deploy/rune-docs

HELM_OCI_REGISTRY?=registry.xiaoshiai.cn
release-helm: package-helm
	helm push ${BIN_DIR}/charts/rune-docs-${VERSION}.tgz oci://${HELM_OCI_REGISTRY}/charts

login:
	docker login ${IMAGE_REGISTRY} -u ${REGISTRY_USERNAME} -p ${REGISTRY_PASSWORD}
	helm registry login ${HELM_OCI_REGISTRY} -u ${REGISTRY_USERNAME} -p ${REGISTRY_PASSWORD}

release: release-image

clean:
	rm -rf $(BIN_DIR)