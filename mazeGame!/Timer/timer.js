
class Timer {
  constructor(durationInput){
    this.durationInput = durationInput;

    //  >>>THE TIME!<<<
    this.durationInput.value = 25;

    this.durationInput.addEventListener('build', this.start());
    
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal'];
        
        if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
          this.pause();
          this.durationInput.value = `G-Job`
          
          document.querySelector('#win').classList.remove('hidden')
          setTimeout(()=> {
            
            document.querySelector('#anime-gj').play();
          }, );
          world.gravity.y = -15;
          world.bodies.forEach(body => { 
            if(body.label === 'wall' || body.label === 'goal') {
              Body.setStatic(body, false);
              // Body.render().fillStyle(body, 'red');
                // fillStyle ='#14fcee'
                // fillStyle:'#ff3c38'
                // fillStyle:'#8c1492'
                // fillStyle:'#6699cc'
            }
          });
        }
      });
    });
  }

  start = () => {
    this.interval = setInterval(this.tick, 5);  
  }

  pause = () => {
    clearInterval(this.interval)
  }

  tick = () => {
    if(this.durationInput.value <= 0 ){
      if(!potato){
        potato = true;
        this.lose();
      }

      
    }
    else {
      if(!(this.durationInput.value < 0)){
        this.durationInput.value = (this.durationInput.value - 0.005).toFixed(3);
      }
    }
  }
 
  lose = () => {
    howCute.play();
    
    setTimeout(() => {
      
      setTimeout(()=> {
        document.querySelector('#lose').classList.remove('hidden');
      }, 500)

      Matter.World.remove(world, goal);
      world.gravity.y = 4;
      world.bodies.forEach(body => { 
        if(body.label === 'wall') {
          Body.setStatic(body, false);
        }
      });
    }, 100)
  }
} 