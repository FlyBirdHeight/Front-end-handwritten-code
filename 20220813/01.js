let _lines=[];
while(line=readline()){
    _lines.push(line);
}
let _str=_lines[0].split('').join('[a-z]*')
console.log(new RegExp(_str).test(_lines[1]));