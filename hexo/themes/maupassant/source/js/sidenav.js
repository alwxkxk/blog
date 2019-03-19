// {
//     text: "Node 1",
//     icon: "glyphicon glyphicon-stop",
//     selectedIcon: "glyphicon glyphicon-stop",
//     color: "#000000",
//     backColor: "#FFFFFF",
//     href: "#node-1",
//     selectable: true,
//     state: {
//       checked: true,
//       disabled: true,
//       expanded: true,
//       selected: true
//     },
//     tags: ['available'],
//     nodes: [
//       {},
//       ...
//     ]
//   }

var tree = [
  {
    text: '项目演示',
    selectable: false,
    nodes: [
            {text: 'demo0.1', href: '/posts/38208'},
            {text: 'demo1', href: '/posts/64786'},
            {text: 'demo2', href: '/posts/64594'}
    ]
  },
  {
    text: '网络',
    selectable: false,
    nodes: [
            {text: '计算机网络基础', href: '/posts/37707'},
            {text: 'IP协议基础', href: '/posts/37286'},
            {text: 'TCP协议基础', href: '/posts/19508'},
            {text: 'HTTP协议基础', href: '/posts/34265'},
            {text: 'MQTT协议基础', href: '/posts/20945'}
    ]
  },
  {
    text: '客户端开发',
    selectable: false,
    nodes: [
        {text: 'HTML、CSS、JS基础', href: '/posts/54080'},
        {text: 'chrome开发者工具', href: '/posts/52429'},
        {text: 'Jquery、Bootstrap基础', href: '/posts/27238'},
        {text: '数据可视化基础', href: '/posts/18173'},
        {text: 'electron基础', href: '/posts/1041'},
        {text: '微信小程序基础', href: '/posts/15341'}
    ]
  },
  {
    text: '服务器开发',
    selectable: false,
    nodes: [
        {text: 'nodejs基础', href: '/posts/56793'},
        {text: 'linux基础', href: '/posts/34982'},
        {text: 'nginx基础', href: '/posts/19114'},
        {text: '数据库基础', href: '/posts/41347'}
    ]
  },
  {
    text: '硬件',
    selectable: false,
    nodes: [
        {text: 'ESP8266基础', href: '/posts/32577'},
        {text: 'nodemcu基础', href: '/posts/31494'}
    ]
  },
  {
    text: '其它',
    selectable: false,
    // state: {expanded: false},
    nodes: [
        {text: '磨刀不误砍柴功', href: '/posts/61760'},
        {text: '资源链接', href: '/posts/37993'},
        {text: '最后的讨论', href: '/posts/41995'},
        {text: '软硬结合', href: '/posts/44755'}
    ]
  }
]

$('#sidenav').treeview({data: tree, showBorder: false, enableLinks: true, backColor: 'transparent'})
$('#sidenav-container').show()

var slideout = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('menu'),
  'padding':200,
  'tolerance': 70
})

slideout.on("open",()=>{
  $('#open-menu').hide();
})

slideout.on("close",()=>{
  $('#open-menu').show();
})

$('#close-menu').click(()=>{
  slideout.close();
})

$('#open-menu').click(()=>{
  slideout.open();
})

// 当浏览次数少于3时，自动弹出菜单栏
let menuFlag=localStorage.getItem("menu-flag")
if(!menuFlag){
  menuFlag = 0
}
else{
  menuFlag = Number(menuFlag)
}

if(menuFlag<3){
  menuFlag += 1
  localStorage.setItem("menu-flag",menuFlag);
  slideout.open();
  setTimeout(() => {
    slideout.close();
  }, 1500);
}
