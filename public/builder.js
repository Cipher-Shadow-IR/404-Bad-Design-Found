const elements = document.querySelectorAll(".element");
const dropZone = document.getElementById("drop-zone");

// 🔥 Dynamic Image Pool (no hardcoding)
const imagePool = [
  "https://source.unsplash.com/random/800x400?travel",
  "https://source.unsplash.com/random/800x400?mountains",
  "https://source.unsplash.com/random/800x400?beach",
  "https://source.unsplash.com/random/800x400?adventure",
  "https://source.unsplash.com/random/800x400?forest",
  "https://source.unsplash.com/random/800x400?roadtrip",
];

// DRAG START
elements.forEach(el => {
  el.addEventListener("dragstart", e => {
    e.dataTransfer.setData("type", el.dataset.type);
  });
});

// ALLOW DROP
dropZone.addEventListener("dragover", e => {
  e.preventDefault();
});

// DROP
dropZone.addEventListener("drop", e => {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");

  if(type === "text"){
    const txt = document.createElement("h2");
    txt.innerText = "New Heading Added";
    dropZone.appendChild(txt);
  }

  if(type === "navbar"){
    const nav = document.createElement("div");
    nav.innerHTML = `
      <div style="background:#6d5cff;padding:10px;color:white;border-radius:8px">
        Home | Blog | Contact
      </div>`;
    dropZone.appendChild(nav);
  }

  if(type === "image"){
    createLoopingCarousel();
  }
});


// 🧠 AUTO LOOPING IMAGE SYSTEM
function createLoopingCarousel(){

  const wrapper = document.createElement("div");
  wrapper.style.width = "100%";
  wrapper.style.overflow = "hidden";
  wrapper.style.borderRadius = "12px";
  wrapper.style.marginTop = "15px";

  const track = document.createElement("div");
  track.style.display = "flex";
  track.style.transition = "transform 0.8s ease";

  wrapper.appendChild(track);
  dropZone.appendChild(wrapper);

  let index = 0;

  // fetch 5 random images automatically
  for(let i=0;i<5;i++){
    const img = document.createElement("img");
    img.src = imagePool[i] + "&sig=" + Math.random();
    img.style.width = "100%";
    img.style.minWidth = "100%";
    img.style.height = "300px";
    img.style.objectFit = "cover";
    track.appendChild(img);
  }

  setInterval(()=>{
    index++;
    if(index >= track.children.length){
      index = 0;
    }
    track.style.transform = `translateX(-${index*100}%)`;
  },2000);
}
