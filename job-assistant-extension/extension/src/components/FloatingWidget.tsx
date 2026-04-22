import React from "react"

export const FloatingWidget = () => {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <h3>Floating Widget</h3>
    </div>
  )
}
