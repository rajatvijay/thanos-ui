import React ,{Component} from 'react'
import Collapsible from "react-collapsible";
import {Icon} from 'antd'



class AlerList extends Component{

    state={collapse:false}


onOpen = ()=>{



}


render(){

const {collapse} = this.state
const {item} = this.props

return(

<li  onClick={()=>this.setState({collapse:!collapse})}>


              <div style={{
                borderTop: "1px solid black",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 29px",
                cursor: "pointer"
              }}>
              
              <div>
              <Icon  style={{margin:"0px 5px 0px -5px",color:"white"}} type="caret-right" rotate={collapse ? 90 : 0} />
              <span style={{ fontSize: 16, color: "#CFDAE3" }}>
                {item.name}
              </span>
              </div>
              <div>
                {item.count > 0 && (
                  <span
                    style={{
                      borderRadius: "50%",
                      backgroundColor: "#D40000",
                      color: "white",
                      margin: "0px 5px",
                      padding: 4,
                      fontSize:12
                    }}
                  >
                    {item.count}
                  </span>


                )}
               
              </div>
              
              </div>

<Collapsible onOpen={()=>this.onOpen(item)} open={collapse}>


</Collapsible>

</li>

)




}



}



export default AlerList