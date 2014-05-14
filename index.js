/**
 * Created by cc on 14-5-13.
 */
'use strict';
var path = require('path');
var fs = require("fs");

function mkdirSync(url,mode,cb){
    var path = require("path"), arr = url.split("/");
    mode = mode || "0755";
    cb = cb || function(){};
    if(arr[0]==="."){//处理 ./aaa
        arr.shift();
    }
    if(arr[0] == ".."){//处理 ../ddd/d
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }
    function inner(cur){
        if(!path.existsSync(cur)){//不存在就创建一个
            fs.mkdirSync(cur, mode)
        }
        if(arr.length){
            inner(cur + "/"+arr.shift());
        }else{
            cb();
        }
    }
    arr.length && inner(arr.shift());
}

/**
 * 写文件
 * @param file
 * @param data
 * @private
 */
var _write = function(file,data){
    mkdirSync(path.dirname(file),0,function(e){
        if(e){
            console.log('出错了',e);
        }
    });
    fs.open(file,"w","0644",function(e,fd){
        if(e) throw e;
        if(typeof data != "string"){data = JSON.stringify(data)};
        fs.write(fd,data,0,'utf8',function(e){
            if(e) throw e;
            fs.closeSync(fd);
        })
    });
}

/**
 * 读文件
 * @param file
 * @returns {*}
 * @private
 */
var _read = function(file){
    var res;
    if(fs.existsSync(file)){
        var data =fs.readFileSync(file,"utf-8").toString();
        if(data){
            try{
                res = JSON.parse(data);
            }catch (e){
                res = data;
            }
        }
    }
    return res;
}


/**
 * 取文件列表
 * @param dir
 * @returns {Array}
 * @private
 */
var _list = function(dir){
    list_res = [];
    list_file = fs.readdirSync(dir);
    for(var i = 0; i < list_file.length; i++){
        file = fs.lstatSync(dir+list_file[i]);
        if(!file.isDirectory()){
            list_res.push(_read(dir+list_file[i]));
        }
    }
    return list_res;
}
var file;
var list_res;
var list_file;

module.exports = {
    list:_list,
    read:_read,
    write:_write
}