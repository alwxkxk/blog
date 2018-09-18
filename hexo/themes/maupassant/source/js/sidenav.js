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
        text:"网络",
        selectable: false,
        nodes:[
            {text: "计算机网络基础",href:"/posts/37707"},
            {text: "TCP/IP通信基础",href:"/posts/19508"},
            {text: "计算机网络基础",href:"/posts/34265"}
        ]
    },
    {
      text: "客户端开发",
      selectable:false,
      nodes:[
        {text: "HTML、CSS、JS基础",href:"/posts/54080"}
      ]
    },
    {
      text: "服务器开发",
      selectable:false,
      nodes:[
        {text:'nodejs基础',href:'/posts/56793'},
        {text:'linux基础',href:'/posts/34982'}
      ]
    },
    {
      text: "硬件",
      selectable: false,
      nodes:[
        {text:'ESP8266基础',href:'/posts/32577'}
      ]
    },
    {
      text: "其它",
      selectable:false,
      state:{expanded:false},
      nodes:[
        {text:'磨刀不误砍柴功',href:'/posts/61760'},
        {text:'资源链接',href:'/posts/37993'},
        {text:'软硬结合',href:'/posts/44755'}
      ]
    }
  ];

  $('#sidenav').treeview({data: tree,showBorder:false,enableLinks:true,backColor: 'transparent'});
  $( window ).resize(function () {
      if(window.innerWidth<1200){
        //   console.log(window.innerWidth,"hide")
          $('#sidenav-container').hide()
      }
      else{
        // console.log(window.innerWidth,"show")
        $('#sidenav-container').show()
      }
  })

