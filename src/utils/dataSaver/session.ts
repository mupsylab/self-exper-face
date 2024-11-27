class Session {
    uploadLength = 0;
    uploadProgress = 0;

    private strSplice(str = "", n = 1024 * 1024) {
        let strArr = [];
        for (let i = 0, l = str.length; i < l / n; i++) {
            const a = str.slice(n * i, n * (i + 1));
            strArr.push(a);
        }
        return strArr;
    }

    offlineSave(str: string, id: string) {
        try {
            this.uploadLength = 0;
            this.uploadProgress = 0;
    
            const blobToSave = new Blob([str], {
                type: "text/plain",
            });
            let blobURL = "";
            if (typeof window.webkitURL !== "undefined") {
                blobURL = window.webkitURL.createObjectURL(blobToSave);
            }
            else {
                blobURL = window.URL.createObjectURL(blobToSave);
            }
            const link = document.createElement("a");
            link.id = "jspsych-download-as-text-link";
            link.style.display = "none";
            link.download = `${id}.csv`;
            link.href = blobURL;
            link.click();

            this.uploadProgress = 1;
            this.uploadLength = 1;
            return true;
        } catch {
            return false;
        }
    }

    async onlineSave(str: string, id: string) {
        this.uploadLength = 0;
        this.uploadProgress = 0;

        let repeatI = 0;
        let r = await fetch(`./data/origin/${id}_${repeatI}.csv`, {
            method: "get"
        });
        while(r.status == 200) {
            repeatI++;
            r = await fetch(`./data/origin/${id}_${repeatI}.csv`, {
                method: "get"
            });
        }

        const strs = this.strSplice(str);
        this.uploadLength = strs.length;
        for (let i = 0; i < this.uploadLength; i++) {
            const r = await fetch("./data/upload.php", {
                method: "post",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: `data=${strs[i]}&id=${id}_${repeatI}`
            });

            if(r.status == 200) {
                this.uploadProgress += 1;
            } else {
                return false;
            }
        }
        return true;
    }
}

export default Session;