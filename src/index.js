document.addEventListener("DOMContentLoaded", () => {
    function qs(selector){
        return document.querySelector(selector)
    } 

    function ce(element){
        return document.createElement(element)
    }

    const dogListPanel = qs("div#dog-bar")
    const dogShowPanel = qs("div#dog-info")
    const goodDogFilter = qs("button#good-dog-filter")
    
    function getDogs(){
        dogListPanel.innerHTML = ""
        fetch("http://localhost:3000/pups")
        .then(res => res.json())
        .then(dogs => {
            displayDogs(dogs)
            goodDogFilter.innerText = "Filter good dogs: OFF"
        })
    }

    function displayDogs(dogs){
        dogs.forEach(dog => {
            makeDogList(dog)
        })
    }

    function makeDogList(dog){
        let span = ce("span")
        span.innerText = dog.name
        span.addEventListener("click", () => renderShowPanel(dog))
        dogListPanel.append(span)
    }

    function renderShowPanel(dog){
        dogShowPanel.innerHTML = ""
        let img = ce("img")
        img.src = dog.image

        let h2 = ce("h2")
        h2.innerText = dog.name

        let btn = ce("button")
        if (!dog.isGoodDog){
            btn.innerText = "Good Dog!"
        }else{
            btn.innerText = "Bad Dog!"
        }

        btn.addEventListener("click", () => {
            let updatedDog = !dog.isGoodDog

            fetch("http://localhost:3000/pups/" + dog.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"    
                },
                body: JSON.stringify({
                    isGoodDog: updatedDog
                })
            })
            .then(res => res.json())
            .then(dog => renderShowPanel(dog))    
            })

        dogShowPanel.append(img, h2, btn)

    }

    getDogs()


    goodDogFilter.addEventListener("click", () => {
        event.preventDefault()
        if(goodDogFilter.innerText == "Filter good dogs: OFF"){
            sortDogs()
        }else{
            getDogs()
        }
    })
    
    function sortDogs(){
        dogListPanel.innerHTML = ""    
        fetch("http://localhost:3000/pups")
        .then(res => res.json())
        .then(dogs => {
            updatedDogList = dogs.filter(dog => dog.isGoodDog == true)   
            displayDogs(updatedDogList)
            goodDogFilter.innerText = "Filter good dogs: ON"})
    }
})    