---
title: 文件上传与抽象封装
---
通常,在开发web应用的时候少不了上传图片等业务.在早期开发的时候,我们会这样做


``某培训课程代码...``

```html

<label>上传头像</label> 
<img id="previewImage">
<label for="avatar"><img src="/upload-btn.png"></label>
<input type="file""  onchange="changeAvatar(this)" name="avatar" id="avatar"  hidden / >

<script>
var avatar;
function changeAvatar(fileInput){
    let file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload=function(e){
    let base64=e.target.result;
        $('#previewImage').attr('src',base64);
        avatar=base64;
    }
    reader.readAsDataUrl(file);
}
</script>
``` 
该模式
![title](https://leanote.com/api/file/getImage?fileId=5aec680eab6441664b001d4e)

该方式的缺点是,每次上传图片都要对应的文件文本框html代码,而且触发的是onchange事件,如果第二次选取的图片与第一次选取的图片是一样的就不会触发onchange事件(隐藏性的bug)

对此,我们进行改进优化,优化为一个js函数,这样就免去了大量的html模板
```html
<button onclick="uploadAvatar()">选择头像</button>

<script>
    function uploadAvatar(){
        selectBase64Image((base64)=>{
            // base64上传头像
                $.ajax()
        })
    }

    function selectBase64Image(callback){
        var inputEl=document.createElement('input');
        inputEl.type='file';
    
        inputEl.onchange=function(){
        var file = inputEl.files[0];
        var reader=  new FileReader();
        reader.onload = function(e){
                var base64 = e.target.result;
                callback(base64)
            }
            reader.readAsDataUrl(file);
        }
        inputEl.click();
        
    }

</script>
```

在上一步,我们已经将原有的代码进行重构,简化了头像上传的代码,``selectBase64Image()``函数,其原理如图
![title](https://leanote.com/api/file/getImage?fileId=5aec79f2ab6441664b001ec8)


在上一步的代码依然有缺点.
1. 利用回调的代码不够优雅
2. 代码的耦合度依然过高

下面我们通过typescript 来编写es2016代码(使用async await关键字结合Promise 消除回调函数).typescript可以转化为es5代码,或者引入补丁来消除浏览器的兼容性
```typescript

/**
// 移除注释,成为 angular2的service
@Service()
**/
export class Common{
    /** 选择文件 */
   selectFile(accept = 'image/*', multiple = true): Promise<File | FileList> {
        return new Promise<File | FileList>((resolve: any) => {
            let inputEl = document.createElement('input');
            inputEl.accept = accept;
            inputEl.multiple = multiple;
            inputEl.type = "file";
            inputEl.accept = accept;
            inputEl.onchange = function () {
                resolve(multiple ? inputEl.files : (inputEl.files as FileList)[0])
            }
            inputEl.click();
        })
    }
    /** 文件转换为base64 */
    convertFileToBase64(file: File): Promise<string> {
        return new Promise(resolve => {
            let reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target["result"])
            }
            reader.readAsDataURL(file);
        })
    }

    /**
     * 
     * @param base64   string
    * 
     * @param outputFormat string 
     * 
     * 将base64图片压缩到一定像素以下
     */
    compressBase64(base64: string, maxsize: number = 40000, outputFormat = "image/png"): Promise<string> {
        return new Promise((resolve, reject) => {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                var width = img.width;
                var height = img.height;
                let compress = 1;
                let rate = 1
                if (width * height > maxsize) { rate = Math.ceil(width * height / 40000); }
                compress = 1 / rate;
                canvas.width = width * compress;
                canvas.height = height * compress;
                ctx.drawImage(img, 0, 0, width, height, 0, 0, width * compress, height * compress);
                let compressData = canvas.toDataURL(outputFormat)
                resolve(compressData);
            };
            img.src = base64;
        });
    }


}



```

在这一次,我们进行将代码继续重构变得更为复杂.将函数的粒度细化成为如下结构
![title](https://leanote.com/api/file/getImage?fileId=5aec847aab6441664b001f94)

可以看见每个函数对应着一次操作.
因此可以在三个基础函数上封装一个``selectBase64Image函数``

```typescript
       /**获得一个base64图片 */
    async selectBase64Image(maxsize?: number):Promise<string> {
        let file: File = await this.selectFile('images/*', false) as File;
        let base64 = await this.convertFileToBase64(file);
        return maxsize ? await this.compressBase64(base64, maxsize) : base64

    }
    /**获取多张base64拖 */
    async selectBase64Images(maxsize?: number) :Promise<string[]>{
        let files: FileList = await this.selectFile('images/*', false) as FileList;
        let base64es = [];
        for (let i = 0; i < files.length; i++) {
            let file = files.item(i);
            let base64 = await this.convertFileToBase64(file);
            base64es.push(maxsize ? await this.compressBase64(base64, maxsize) : base64);
        }
        return base64es;
    }


```

这里需要解释下最终的完美版为什么要用typescript编写.请先看下图,全程智能语法提示,类型检查系统,这是一个vue-typescript项目。
![title](https://leanote.com/api/file/getImage?fileId=5aec7d22ab6441664b001f11)


最终代码
```typescript
export class Common {
    /** 选择文件 */
    selectFile(accept = 'image/*', multiple = true): Promise<File | FileList> {
        return new Promise<File | FileList>((resolve: any) => {
            let inputEl = document.createElement('input');
            inputEl.accept = accept;
            inputEl.multiple = multiple;
            inputEl.type = "file";
            inputEl.accept = accept;
            inputEl.onchange = function () {
                resolve(multiple ? inputEl.files : (inputEl.files as FileList)[0])
            }
            inputEl.click();
        })
    }
    /** 文件转换为base64 */
    convertFileToBase64(file: File): Promise<string> {
        return new Promise(resolve => {
            let reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target["result"])
            }
            reader.readAsDataURL(file);
        })
    }

    /**
     * 
     * @param base64   string
    * 
     * @param outputFormat string 
     * 
     * 将base64图片压缩到一定像素以下
     */
    compressBase64(base64: string, maxsize: number = 40000, outputFormat = "image/png"): Promise<string> {
        return new Promise((resolve, reject) => {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                var width = img.width;
                var height = img.height;
                let compress = 1;
                let rate = 1
                if (width * height > maxsize) { rate = Math.ceil(width * height / 40000); }
                compress = 1 / rate;
                canvas.width = width * compress;
                canvas.height = height * compress;
                ctx.drawImage(img, 0, 0, width, height, 0, 0, width * compress, height * compress);
                let compressData = canvas.toDataURL(outputFormat)
                resolve(compressData);
            };
            img.src = base64;
        });
    }
    /**获得一个base64图片 */
    async selectBase64Image(maxsize?: number): Promise<string> {
        let file: File = await this.selectFile('images/*', false) as File;
        let base64 = await this.convertFileToBase64(file);
        return maxsize ? await this.compressBase64(base64, maxsize) : base64

    }
    /**获取多张base64图片 */
    async selectBase64Images(maxsize?: number): Promise<string[]> {
        let files: FileList = await this.selectFile('images/*', false) as FileList;
        let base64es = [];
        for (let i = 0; i < files.length; i++) {
            let file = files.item(i);
            let base64 = await this.convertFileToBase64(file);
            base64es.push(maxsize ? await this.compressBase64(base64, maxsize) : base64);
        }
        return base64es;
    }
}

```

经过了一系列的代码,我们的体系结构就接近于如下
![title](https://leanote.com/api/file/getImage?fileId=5aec8924ab6441683e001f5a)

