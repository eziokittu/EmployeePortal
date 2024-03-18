import React from 'react'

function Alert({messages}) {
  return (
    ()=>{
      alert(
        messages.map(
          m => {m}
        )
      )
    }
  )
}

export default Alert