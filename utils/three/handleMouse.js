export const handleMouse = (mouse) => {
  const onUpdate = (e) => {
    // console.log(e)
    mouse.value.x = e.clientX;
    mouse.value.y = e.clientY;
  }
  window.addEventListener("mousemove", onUpdate);
}