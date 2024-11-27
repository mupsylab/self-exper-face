import { defineStore } from "pinia";

export const useLoaderAssets = defineStore("loader-assets-to-blobs", {
    state() {
        return {
            _running: false,
            tmpSet: new Set<string>(), // 用于存储准备加载的静态资源
            blobMap: new Map<string, string>(), // 用于存储最后的blob资源
            loading: 0, // 处于加载中的进度条
        }
    },
    getters: {
        isInit(): boolean { return !!this.blobMap.size },
        isRunning(): boolean { return this._running },
        isFinish(): boolean { return !this.tmpSet.size },
        progress(): {len: number, left: number, loading: number} {
            return {
                len: this.tmpSet.size + this.blobMap.size,
                left: this.tmpSet.size,
                loading: this.loading
            }
        }
    },
    actions: {
        _addAssetsToBlobAsync(url: string) {
            const _this = this;

            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                _this.loading -= 1;
                if (this.status == 200) {
                    const blob = this.response;
                    _this._loadSuccess(url, blob);
                } else {
                    _this._loadError(url, "Error");
                }
            }
            let c = 0;
            xhr.onprogress = (e) => {
                this.loading += (e.loaded - c) / e.total;
                c = e.loaded;
            }
            xhr.ontimeout = function() {
                _this._loadError(url, "Timeout!");
            }
            xhr.send();
        },
        _loadSuccess(url: string, blob: Blob) {
            this.tmpSet.delete(url);
            this.blobMap.set(url, URL.createObjectURL(blob));
        },
        _loadError(url: string, e: string) {
            console.warn(`load Assets Error: ${e}, url: ${url}`);
        },
        addAssets(str: string) {
            this.tmpSet.add(str);
        },
        removeAssets(str: string) {
            URL.revokeObjectURL(this.getAssets(str));
            this.tmpSet.delete(str);
        },
        getAssets(str: string) {
            const url = this.blobMap.get(str)
            return url ? url : "";
        },
        startLoad() {
            if(this.isRunning) {
                return 0;
            }
            this._running = false;

            this.tmpSet.forEach(v => {
                this._addAssetsToBlobAsync(v);
            });

            this._running = true;
            return 1;
        }
    }
});