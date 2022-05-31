var members = ['yongki', 'k8805', 'hoya'];
members.forEach( (member) => {
    console.log(member);
})

console.log();
var roles = {
    'programmer' : 'yongki',
    'designer' : 'k8805',
    'manager' : 'hoya'
}
for(var name in roles) {
    console.log('object => ', name, ', value => ', roles[name]);
}