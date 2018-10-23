# ng-container的使用方式
在angular中通常需要使用的两个结构型指令语法是 *ngIf *ngFor .然而两个指令不能够同时使用在同一个div上.因为模板语法不知道是先执行哪一个结构型指令。

```html
<!-- 模板语法错误 -->
<ul  >
<li *ngFor="let item of list;let i = index;" *ngIf="i <4"> {{item.title}}</li>
</ul>
```
而我们业务有时候会遇到,显示一部分数据的前几条,或是实现类似Tab切换的效果。

如果写的像下面的代码
```html
<ul >
<li*ngFor="let item of list;let i = index">
<div *ngIf="i<4">
  {{item.title}}
</div>
</li>
</ul>
```

那么生成的元素就会比原本想要生成的元素多一层用于 ```*ngIf```指令的div元素
```html
<!--此时生成的html-->
<ul>

<li><div>{{item[0].title}}</div></li>
<li><div>{{item[1].title}}</div></li>
<li><div>{{item[2].title}}</div></li>
<li><div>{{item[3].title}}</div></li>
</ul>



<!-- 而我想要生成的 html-->
<ul>
<li>{{item[0].title}}</li>
<li>{{item[1].title}}</li>
<li>{{item[2].title}}</li>
<li>{{item[3].title}}</li>
</ul>
```

用于解决这个问题,angular 有一个 ```<ng-container>```标签
ng-container标签是一个虚拟的容器,本身不会产生任何html,如果此时加上*ngIf则只会编译ng-contaienr内部的模板

```html
<!--此时会生成 <div> hello </div> -->
<ng-container *ngIf="true">
    <div> hello </div>
</ng-container>

```
综上所述,我们改进原有的模板语法

```html
<ul>
<ng-container *ngFor="let item of list;let i =index">
<li *ngIf="i<4">{{item.title}}</li>
</ng-container>
</ul>

<!--此时生成我么你想要的html模板-->
<ul>
<li>{{item[0].title}}</li>
<li>{{item[1].title}}</li>
<li>{{item[2].title}}</li>
<li>{{item[3].title}}</li>
</ul>
```

# ng-content的使用方法

有时候我们希望能够有一个复杂的页面导航条,但是导航条里的菜单是自定义的,如下

```html
<!-- app.component.html -->
<app-navbar>
    <ul class="menu">
        <li class="menu-item">首页</li>
    </ul>

</app-navbar>

<!-- app-navbar.component.html-->
<div class="navbar">

<i class="toggle-icon"></i>
</div>
```
此时并不会显示导航菜单
因为```app-navbar```组件并不会去加载 子级组件的内容

![title](https://leanote.com/api/file/getImage?fileId=5ae41006ab64412f33000a62)

要想挂载子级内容
```html
<!-- app-navbar.component.html-->
<div class="navbar">
<!--在此处使用ng-content挂载导航栏菜单-->
<ng-content></ng-content>
<i class="toggle-icon"></i>
</div>

<!-- app-component.html-->
<app-navbar>
    <ul class="menu">
        <li class="menu-item">首页</li>
    </ul>
</app-navbar>
```

