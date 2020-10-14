import {FormDelegate} from "../modules/delegates/form.js"
import {Operations}  from "./main.js"

$( function(){
    //customElements.define('form-node', Form, { extends : 'form'});
    customElements.define('form-delegate', FormDelegate, { extends : "img"});

    $( "div.blocks").append('<img is="form-delegate">');

    // select all UI template drop zone childs nodes and make them hightlight border on drag over.
    // $( "#ui-template").contents().on(
    //     'dragover',
    //     (e) => {
    //         console.log(`I sense drag over me: ${e.target.id}`);
    //     }
    // );
    // setup node properties 
    var ops = new Operations();
    //console.log(ops);
    ops.properties_node.properties();
    
});


