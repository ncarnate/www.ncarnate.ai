{ script = document.createElement('script'); script.innerHTML="function xx() {console.log(this == document.body)}"; document.body.append(script); xx.call(script.parentElement)
