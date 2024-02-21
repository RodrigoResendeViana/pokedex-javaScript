const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.name = pokeDetail.name
    pokemon.number = pokeDetail.id
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [ type ] = types   //Destructuring

    pokemon.types = types
    pokemon.type = type

    return pokemon
}

pokeApi.getPokemonDetails = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url) 
    //Retorna uma response da requisição HTTP na url indicada
    
    //Caso a requisição funcione, passará pelo then
        .then((response) =>  response.json())     //Arrow function - função normal, só que não declarada| Nesse caso, o código só seria o return desse response.json, então colocamos na mesma linha
        
        //O return do item anterior vai para o then seguinte caso não haja erro
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)

        //Caso a requisição de erro, passará pelo catch
        .catch(function (error) {
            console.error(error)
        })

    //Independente das 2 anteriores, passará pelo finally por último (Não é obrigatório)
    // .finally(function () {
    //     console.log('Requisição concluída')
    // })
}

