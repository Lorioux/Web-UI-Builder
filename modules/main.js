

import { layout } from "./properties/layout.js";
'use strict';
export class Operations {
    
    constructor(){

        // tempory registry for child and candidate parent elements 
        this.membership = { 
            childnode : void 0,
            parentnode : void 0,
            parentcopy: void 0,
            candidates : {child:void 0, father: void 0},
            finalize : () =>{
                //console.log( this.family_membership_candidates.family);
                var c = this.membership.candidates.child
                this.adopt_child_as_family_member(c)
            },

        };

        this.membership.__defineSetter__(

            'childnode',
            (v) => {
                this.membership.candidates.child = v;
                //console.log("Adding new child node ");
                $( "#ui-template" )
                    .on(
                        'dragover',
                        // register main node to become parent when there is not any child node OR
                        (e) => {
                            //console.log("Dragging Over me " + e.target.id);
                            this.apply_for_parentship(e.target);
                            
                        }
                    )
                    .contents().on(
                        'dragover',
                        // register each existing child node to become parent to be tested if it's 
                        // valid to host the child node element.
                        (e) => {
                            //console.log("Dragging Over me " + e.target.id);
                            this.apply_for_parentship(e.target);
                            
                        }
                    );
                    
            }
        );

        this.membership.__defineSetter__(

            'parentnode',
            (v) => {
                this.membership.candidates.father = v;
                //console.log(node);
            }
        );

        // temporary properties node and values hold
        this.properties_node = {
            node : $(".properties"),
            layout: {

                marging : (prop) =>{
                    // define the layout interface to be displayed, if it note defined yet.
                    var node  = document.createElement("div");
                    node.id = "layout_marging";
                    node.style.padding = "4px";
                    node.style.marginBottom = "4px";
                    node.style.borderRadius = "4px";
                    node.style.width = "fit_content";
                    var sp = document.createElement("span");
                    sp.innerText = "Layout marging";
                    node.appendChild(sp)    
                    prop.layout.define(prop, node);
                }, 
                padding : (prop) =>{
                    var node  = document.createElement("div");
                    node.id = "layout_paddings";
                    node.style.padding = "4px";
                    node.style.borderRadius = "4px";
                    var sp = document.createElement("span");
                    sp.innerText = "Layout padding";
                    node.appendChild(sp)
                    prop.layout.define(prop, node);
                },

                define: (prop, node) =>{

                    //check if there are layout fields defined yet and return
                    var defined = prop.node[0].children[`${node.id}`]
                    //console.log(exists);
                    if(typeof defined === "undefined" ){

                        // define layout properties fields for marging or padding
                        var left = document.createElement("input");
                        left.placeholder = "Left";
                        var right = document.createElement("input");
                        right.placeholder = "Right";
                        var top  = document.createElement("input");
                        top.placeholder = "Top";
                        var bottom = document.createElement("input");
                        bottom.placeholder = "Bottom";

                        var lyfieds = document.createElement("div");
                        lyfieds.style.display = "grid";
                        lyfieds.style.gridTemplateColumns = "1fr 1fr";
                        //lyfieds.style.gridTemplateRows = "64px / auto auto auto";
                        lyfieds.style.gridRowGap = "4px";
                        lyfieds.style.gridgap = "10px";
                        lyfieds.style.backgroundcolor = "#2196F3";
                        lyfieds.style.padding = "10px";
                        
                        node.style.border = "1px solid gray";
                        
                        stylefields([left, right, top, bottom])
                        // lyfieds.appendChild(left);
                        // lyfieds.appendChild(right);
                        // lyfieds.appendChild(top);
                        // lyfieds.appendChild(bottom);
                        node.appendChild(lyfieds);
                        prop.node.append(node);
                        
                        function stylefields(fields){
                            fields.forEach(element => {
                                //var div = document.createElement("div");
                                element.style.width = "56px";
                                //div.appendChild(element);
                                lyfieds.appendChild(element);
                            });
                        }
                    } ;              
                    
                }
            },
            border: {
                node : document.createElement("div").setAttribute("class" , "w3-content borders"),
                
            },

            properties(){
                this.layout.marging(this);
                this.layout.padding(this);
                
                //console.log(this.node);
            },
            //TODO: add more
        };

        // tempory registration for adoption when citized is being dragged around others
        this.apply_child_for_adoption = (me) => {
            
            this.membership.childnode = me;
        };

        // temporary registration for parentship when child is within  candidate boundaries.
        this.apply_for_parentship = (future_parent) => {
            this.membership.parentnode = future_parent;
        };

        // temporay parentship candidature removal, when child is out boundaries.
        this.retire_parentship_candidature = () => {
            this.membership.parentnode = void 0;
        };

        // temporay adoption candidature removal, when child is already adopted.
        this.retire_adoption_application = () => {
            this.membership.childnode = void 0;
        };

        // child copy parent location boundaries when accepted for family membership
        this.copy_parent_boundaries = (family_membership_candidates) => {
            this.membership.parentcopy =  {
                width   : this.membership.parentnode.width,
                height  : this.membership.parentnode.height,
            }
        };

        // adopt child when is dropped on parentship candidate boundaries
        this.adopt_child_as_family_member = ( future_child ) =>{
            //var id = this.membership.candidates.father.id;
            //var c = this.family_membership_candidates.family.child;
            //$( "#" + id).append(c);
            //console.log(this.membership.candidates.father);
            var parent = this.membership.candidates.father;
            var childrencount = parent.childElementCount;
            future_child.id = `${parent.id}-${future_child.name}-${childrencount + 1}`;
            parent.appendChild(future_child);
            
            // give some id as combination of father's id and number of children
             

        }

        // change family membership when child is moved out parent boundaries
        this.change_family_membership = (me) =>{
            this.membership.childnode = me;
            
            // start new adoption procedure
            this.adopt_child_as_family_member( future_child )
        };

        // check child is registered yet.
        this.is_child_clone_registered = () =>{
            this.membership.childnode !== 'undefined' ? true : false; 
        };

        // check parent ins registered yet.
        this.is_parent_candidate_registered = () =>{
            this.membership.parentnode !== 'undefined' ? true : false; 
        };


        // retrieve node properties on click or selected, and display on left side properties area for edit and update. 
        this.show_node_properties = (me) => {
            
            // call this function to retrieve and show node style classes.
            this.show_node_style_classes(me);
            
            // get properties object from provide nonde
            var properties = me.properties;
            var id = properties.id;
            var _class = properties.class;
            var _title = properties.title;
            var layout = properties.layout;
            var border = properties.border;
            var attributes = properties.attributes;

            // find and select properties area node to display the obtained values above.
            //this.properties_node.properties();

            //console.log(me);

        };

        // retrieve node styles on click or selected, and display on left side properties area for edit and update.
        this.show_node_style_classes = (me) =>{

        };

        
    }

}

//export var operations = new Operations;
