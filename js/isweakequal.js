var ao={m:{m:"I'm Object contained included to Object_source properties",v:0.44},v:-1}


var bo={a:0,b:"ca",c:{n:"",m:"I'm object",v:42},d:ao}
var co={a:7,b:"cat",c:{n:"",v:"4"},d:ao}

const PT = [true,4,"khjkjkh"].map(e=>typeof(e));
function isPrimitive(x){return PT.includes(typeof(x))}

function weakequal(a,b){
	console.log('going deeper to recursive')
		for(let key in a){
			console.log('checking key %s',key)
			
			if(b[key]==undefined){ return false}
			let v=a[key];
			
			if(isPrimitive(v)){
				if(v!=b[key]){return false}
			} else {
				if(!weakequal(v,b[key])){return false}
			}
		}
	return true;
}















/*
    var isweakequal=(function(a,b){
        for(let k in a){
            if (!b.hasOwnProperty(k)) {return false}
            let v=a[k];
            if (isPrimitive(v)){
                if(v!=b[k]){return false}
            } else {
                if(!isweakequal(v,b[k])){return false}
            }
        }
        return true
    }).bind((()=>{
        this.PT=[4,"x",true].map(e=>typeof(e));
        this.isPrimitive=function(x){return this.PT.includes(x)}
        return {PT:this.PT,isPrimitive:this.isPrimitive}
    })());

    function isweakequal(a,b){
        const PT=[4,"x",true].map(e=>typeof(e));
        function isPrimitive(x){return PT.includes(x)}
        for(let k in a){
            if (!b.hasOwnProperty(k)) {return false}
            let v=a[k];
            if (isPrimitive(v)){
                if(v!=b[k]){return false}
            } else {
                if(!isweakequal(v,b[k])){return false}
            }
        }
        return true
    }
*/
	function weq(a,b,rs={err:[],p:""}){
		const PT=[4,"x",true].map(e=>typeof(e));
        function isPrimitive(x){return PT.includes(x)}
		var eq=true;
		
        for(let k in a){
			let sp=rs.p+"."+k;
			
            if (!b.hasOwnProperty(k)) {
				rs.err.push("key "+k+" from a." +sp+" is missed")
				eq=false
				} else {
						let v=a[k];
						if (isPrimitive(v)){	
							if(v!=b[k]){
								
								rs.err.push("key "+k+" from a." +sp+" is has value "+v+" while corresponding b."+sp+" is "+b[k])
								eq=false
								}
						} else {
							//weq(v,b[k],p+"."+k);
							//mq.concat(weq(v,b[k],p+"."+k,mq))
							rs.p=sp;
							return weq(v,b[k],rs);
							}
				}
        }
        return {equal:eq,errors:rs.err}
    }