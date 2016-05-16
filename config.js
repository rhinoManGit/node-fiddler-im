// module.exports = {
//     port: 8006,
//     projects:[
//         {
//             rules:[
//                 {
//                     match:'regex:(?isx)ke\.qq\.com\/cgi-bin',
//                     action:'[Ignore] // Ignore'
//                 },{
//                     match:'regex:(?isx)ke\.qq\.com\/[\s\S]*\.cgi',
//                     action:'[Ignore] // Ignore'
//                 },{
//                     match:'regex:(?isx)index\.html',
//                     action:'/Users/y/projects/macfiddler/test.html'
//                 }
//             ],
//             hosts:[
//                 {
//                     ip:'127.0.0.1',
//                     domain:'ke.qq.com'
//                 }
//             ]
//         }
//     ]
// };

module.exports = {
    port: 8006,
    projects:[
        {
            rules:[
            ],
            hosts:[
            ]
        }
    ]
};