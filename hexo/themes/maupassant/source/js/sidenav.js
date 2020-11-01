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


var pathName = window.location.pathname


// 软硬结合的菜单栏
var tree = [
  {
    text: '软硬结合导读',
    href:'/posts/44755'
  },
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
        {text: '调试技巧', href: '/posts/54436'},
        {text: '工具推荐', href: '/posts/61760'},
        {text: '资源链接', href: '/posts/37993'},
        {text: '最后的讨论', href: '/posts/41995'},
        {text: '软硬结合', href: '/posts/44755'}
    ]
  }
]
var treeList = []
tree.forEach((item)=>{
  if(item.nodes){
    item.nodes.forEach(node=>{
      treeList.push(node.href)
    })
  }else{
    treeList.push(item.href)
  }
})
var treeFlag = false
treeList.forEach(item=>{
  if(pathName === item || pathName === item+'/'){
    treeFlag = true
  }
})

// 3D可视化 的菜单栏
var tree3d = [
  {
    text: '3D可视化导读',
    href:'/posts/30679'
  },
  {
    text: '项目示例',
    selectable: false,
    nodes: [
      {text: 'a-模型拆解示例', href: '/posts/2544'},
      {text: 'b-智慧城市', href: '/posts/46791'},
      {text: 'c-数据中心', href: '/posts/19890'}
    ]
  },
  {
    text: '基础示例',
    selectable: false,
    nodes: [
      {text: '1-模型制作与展示', href: '/posts/42378'},
      {text: '2-模型数据', href: '/posts/45270'},
      {text: '3-光线痕迹', href: '/posts/5988'},
      {text: '4-动画', href: '/posts/60366'},
      {text: '5-显示动态图', href: '/posts/52736'},
      {text: '6-屏幕坐标转换', href: '/posts/56155'},
      {text: '7-开关门(不动点)', href: '/posts/48386'},
      {text: '8-聚焦靠近', href: '/posts/30581'},

      
    ]
  },
  
  {
    text: 'Blender',
    selectable: false,
    nodes: [
      {text: '常用操作', href: '/posts/46886'},
      {text: '导入城市建筑(.osm)', href: '/posts/20949'},
      {text: '导入城市建筑(.rdc)', href: '/posts/4195'}
    ]
  }
  ,
  {
    text: '其它',
    selectable: false,
    nodes: [
      {text: '3D案例收集', href: '/posts/31929'}, 
      {text: 'PS常用技巧', href: '/posts/27566'}, 
      {text: 'PS制作科技感界面', href: '/posts/47064'}, 
      {text: 'three.js性能优化', href: '/posts/5200'},
      {text: '线性代数基础知识归纳', href: '/posts/1192'}, 
      {text: '3D温场效果', href: '/posts/44479'}, 
    ]
  }
]

var tree3dList = []
tree3d.forEach((item)=>{
  if(item.nodes){
    item.nodes.forEach(node=>{
      tree3dList.push(node.href)
    })
  }else{
    tree3dList.push(item.href)
  }
})
var tree3dFlag = false
tree3dList.forEach(item=>{
  if(pathName === item || pathName === item+'/'){
    tree3dFlag = true
  }
})

var treeData = tree3dFlag ? tree3d : tree
console.log(treeData,tree3dFlag)


setTimeout(() => {
  $('#sidenav').treeview({data: treeData, showBorder: false, enableLinks: true, backColor: 'transparent'})
  $('#sidenav-container').show()

  var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding':200,
    'tolerance': 70
  })

  slideout.on("open",()=>{
    $('#open-menu').css('position','fixed')
    $('#open-menu').css('left','260px')
  })

  slideout.on("close",()=>{
    $('#open-menu').css('position','sticky')
    $('#open-menu').css('left','2px')
  })

  $('#open-menu').click(()=>{
    slideout.toggle();
  })

  // 当浏览次数少于3时，自动弹出菜单栏
  var menuFlag=localStorage.getItem("menu-flag")
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
}, 200);



