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
            {text: "TCP/IP基础",href:"/posts/37707/"}
        ]
    },
    {
      text: "ESP8266",
      selectable: false,
      nodes:[
        {text:'ESP8266基础',href:'/posts/32577'}
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

