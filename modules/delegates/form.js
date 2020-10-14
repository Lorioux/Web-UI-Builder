import { Operations } from "../main.js"
import {layout, border} from "../properties/layout.js"
import {GlobalAttributes} from "../properties/attributes.js"


var ops = new Operations;
var glob_atts = new GlobalAttributes;

export class Form extends HTMLFormElement{
    
    //family_membership_candidates;
    
    constructor (){
        super();
        this.name = "FormNode";
        this.draggable = "true";
        //this.style.resize = "both";
        //this.style.overflow = "auto";
        this.style.width = "64px";
        this.style.height = "48px";
        this.style.border = "1px solid gray";
        this.draggable = true;
        this.class = "w3-form draggable";
        this.properties = {
            // valid parents for form elements to verify when is appending.
            valid_parent : [
                HTMLDialogElement, 
                HTMLDivElement, 
                HTMLBodyElement, 
                HTMLTableSectionElement,
            ],
        
            valid_child : [
                HTMLInputElement, 
                HTMLButtonElement, 
                HTMLFieldSetElement, 
                HTMLSelectElement, 
                HTMLLabelElement,
            ], 
    
            valid_styleclasses: {
                main_name : "w3-container",
                additionals: [
                    {'w3-col' : {}}
                ]
            },

            title : glob_atts.title,
            draggable: glob_atts.draggable,
            action : "",
            method : "",
            "data-set": "",
            id : "",
            class: "",
            attributes : "",
            layout : Object.create(layout),
            border : Object.create(border),

            style_class: void 0,

        };
        this.isdragging = false;

        //const shadow = this.attachShadow({mode : "open"});

        /**
         * TODO:
         *  1 - When click or select, above defined properties are displayed into the properties area.
         *  2 - When is being moved from actual parent to another must verify, either this future parent is valid.
         *  3 - When a son is being dropped over it must test its validity, and display an message when is invalid.
         *  4 - When a son is being dragged over it must highlight its borders and remove hightlight when is dropped or 
         *      dragged out.
         *  5 - When 
         */ 
        
        // TODO: 1 - displayed into the properties area
        this.onclick = (e) => {
            // call show node properties operation in Operations
            ops.show_node_properties(this);
            this.handle_draganddrops(this)
        };

        

        // Handle UI template area drag and drop.
        /**
         * While there are nested elements acting as child and parent node, ensure that when only one of them is draggable at time.
         * When dragging child node, parent should not be dragged simultaneously. On the otherhand, when dragging parent all child 
         * node shall drag together.
         * For each click event on the child node deactivate draggable on parent node, register its id, start time count-down and check either the node is 
         * dragging. if not, re-activate draggable (only on parent nodes). 
         * */ 
        this.handle_draganddrops = (e) => {
            
            $( "#" + e.id).draggable()
                .resizable();
            //console.log(e.parentNode.classList.value);
            var parent = e.parentNode;
            // deactivate parent draggable
            if (parent.classList.contains("ui-draggable" )){
                console.log("deactivating parent dragg...");
                parent.classList.remove("ui-draggable", "ui-draggable-handle");

                // check if child node is dragging or or clock still ticking.
                var timeOutID = window.setTimeout(
                    () => {
                        // re-activate
                        $( this ).draggable();
                        
                        // print timeout message.
                        window.console.log;

                        // clear the time out
                        window.clearTimeout(timeOutID);

                    },
                    2 * 1000, "Parent draggable re-activated due timeout"
                );
                
            };
        };
        
        // handle drag start event and update this.isdragging property
        // Also register this instance as candidate child node for another parent node.
        this.ondragstart = () => {
            this.isdragging = true;
            console.log("Started...");
            //  register for new adoption.
            ops.apply_child_for_adoption(this) ;
        };

        this.ondragexit =  () => {
            console.log("Exit");
            $( this ).removeClass( "ui-draggable ui-draggable-handle")
        };        

        // check if this child node is dragging, if not re-activate parent draggable;
        //$( "#" + e.id ).draggable();

    }
};



export class FormDelegate extends HTMLImageElement{
    constructor(){
        super();
        
        //const shadow = this.attachShadow({mode : "open"});
        // set this delegate attributes;
        $( function(){
            // register the client custom node here.
            customElements.define('form-node', Form, { extends : 'form'});
            
            $( "img[is=form-delegate")
                .attr(
                    {
                        src:"src/icons/form.svg",
                        width:"72px",
                        draggable:"true",
                        id:"for-form",
                    }
                )
                .css({
                    margin : '4px',
                });
        });

        //var delg = document.getElementById('delegate_form');
        this.ondragstart = () => {
            console.log("Drag started");

            /**
             * TODO: create the form elements below.
             *  1 - create a new form node (instance of Form custom class) to append in the template area.
             *  2 - register the created node to be fetched an adoption operations delegate
             */
            var formnode = document.createElement("form", {is : "form-node"});
            ///var members = Object.create(ops);
            ops.apply_child_for_adoption(formnode) ;
            
        };

        this.ondragend = () => {
            //childnode = ops.family_membership_candidates.childnode;
            //console.log("Dropped Here.");
            //ops.adopt_child_as_family_member(ops.family_membership_candidates.childnode)
            ops.membership.finalize();
        };
        
    }
}

//customElements.define('FormDelegate', FormDelegate, { extends : "img"});