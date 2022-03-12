const Tozny = require('@toznysecure/sdk/node')


const alicia = Tozny.storage.Config.fromObject({
  public_signing_key: "LnRdfo5hIm2UeNbKo0yGxqcd5eEraP5vHyNRkOISczk",
  private_signing_key: "_yK1sfc9maK2O9rOl_6AqqSFqM9uCw4rkYXWFthQEO0udF1-jmEibZR41sqjTIbGpx3l4Sto_m8fI1GQ4hJzOQ",
  client_id: "3fb4fd17-ec56-4f68-be4a-f36bd4c1fbb5",
  api_key_id: "2a6f7491bb8a55b9812742e0bb76086523fad9d97235fa89393b7960c9e6e776",
  api_secret: "bb369a7f055ac32e60bfde22bbcf5fc3cdbc3a2e6e42fb622ff4d4371eaffaef",
  public_key: "4eELw-1DsB_C7H5FIo-3kSXArYeg3CVRXj9Fc-v_9Es",
  private_key: "3ggdc-SzKAugwPbWy1BfEbbaeFOVZt8hIA0p3ALqe6Q",
  api_url: "https://api.e3db.com"
})

const bruce = Tozny.storage.Config.fromObject({
  public_signing_key: "zo6Wv0IiEM3WGhO_kJe2ju5LULUQa8mlnBV62r3Yy1k",
  private_signing_key: "z4nO-d117mQhkx6OXXBCe4U19Xf3Kt2hMHhWzLL5XC3Ojpa_QiIQzdYaE7-Ql7aO7ktQtRBryaWcFXravdjLWQ",
  client_id: "26c4f3bb-c787-4d2a-a491-328240b1b495",
  api_key_id: "f0a59330c1e87e72eae9ef3c521fd891d8929377dea543c9dd23cfabb8dcb34f",
  api_secret: "cfcd605935ecd1b55db9693f02901e9959c934bed75251cef8ccf1a187c50657",
  public_key: "nJMQ0epogWkNtyKebuPb0toxHg32oO0qiKEqUJ7gXn4",
  private_key: "P4yWcb21SraBdtjM8RSSnQKFzysyY18DBO-2F5MWzn0",
  api_url: "https://api.e3db.com"
})

const clarence = Tozny.storage.Config.fromObject({
  public_signing_key: "R34rhJrtNP58xeaT92fp-XhChitbpKHJXKtcDj5v7Jc",
  private_signing_key: "vVdhBol3PQOpSKemOF5jZpQBNwcWnDC8tyy09qVG-ytHfiuEmu00_nzF5pP3Z-n5eEKGK1ukoclcq1wOPm_slw",
  client_id: "3cdc5ccb-4394-4e25-bac4-10c0d3c5ce03",
  api_key_id: "07045f8725989e72c7faa5c4bea3f7c1f763f6a3a01263126a3ea6081fc77b7e",
  api_secret: "24380c3d0f5841b87aa74ddd058c0218b13bd127946f208bd11295f11d94da54",
  public_key: "LgqL8IL70K3L1jVKg3P7602C5Y5eofDA2PYCJn9AEic",
  private_key: "PlncAm0l5lGRY5_WmnvfR3L0xA0_bfbIKcRqWC6U3_U",
  api_url: "https://api.e3db.com",
})
const Alicia = new Tozny.storage.Client(alicia)
const Bruce = new Tozny.storage.Client(bruce)
const Clarence = new Tozny.storage.Client(clarence)

let AliciaMove = {move: ' '}
let BruceMove = {move: ' '}
let Round;

async function RecordMove(player, playerMove) {
  const prompt = require('prompt-sync')();

  try {
    const written = await player.writeRecord(
      'Player',
      {
        Move: 'error',
        Round: 'error'
      }
    )
    const read = await player.readRecord(written.meta.recordId)
    read.data.Move = prompt('Enter Rock, Paper, or Scissor ')
    console.log(`Move: ${read.data.Move}`)
    playerMove.move = read.data.Move
   
    read.data.Round = prompt('Round number? ')
    console.log(`Round: ${read.data.Round}`)
    Round = read.data.Round 

    await player.updateRecord(read)

    return read
  } catch(e) {
    console.error(e)
  }
}

async function Retrieve(player) {
 try {
    const request = new Tozny.types.Search(true, true)
    //if (!allWriters)
      //request.match({ type: type })
    //else
    request.match({ type: 'Player', key: 'Move' }, 'AND', 'EXACT')
    const resultQuery = await player.search(request)
    const record = await resultQuery.next()
    //for(let i of record)
      //console.log(`Found record ${i.meta.recordId}: ${i.data.Move}`)
    return record
  } catch (e) {
    console.error(e)
  } 
}


async function Judge(judge) {
  try{
    await RecordMove(Alicia, AliciaMove)
    await RecordMove(Bruce, BruceMove)

    const written = await judge.writeRecord(
      'Judge',
      {
        Round: 'error',
        Winner: 'error'
      }
    )
    
    const read = await judge.readRecord(written.meta.recordId)
   
    if(AliciaMove.move === BruceMove.move)
      read.data.Winner = 'Tie'

    else if(AliciaMove.move === 'Rock'){
      if(BruceMove.move === 'Paper')
        read.data.Winner = 'Bruce'
      if(BruceMove.move === 'Scissor')
        read.data.Winner = 'Alicia'
    }

    else if(AliciaMove.move === 'Paper'){
      if(BruceMove.move === 'Scissor')
        read.data.Winner = 'Bruce'
      if(BruceMove.move === 'Rock')
        read.data.Winner = 'Alicia'
    }

    else if(AliciaMove.move === 'Scissor'){
      if(BruceMove.move === 'Rock')
        read.data.Winner = 'Bruce'
      if(BruceMove.move === 'Paper')
        read.data.Winner = 'Alicia'
    }

    else
      read.data.Winner = 'None'
    
    read.data.Round = Round

    await judge.updateRecord(read)
  } catch(e) {
    console.error(e)
  }

}

//Share record access to another client

const shareToAlicia = '3fb4fd17-ec56-4f68-be4a-f36bd4c1fbb5'
const shareToClarence = '3cdc5ccb-4394-4e25-bac4-10c0d3c5ce03'
const typeToShare = 'Round'

async function ShareRecord(player) {
  try {
    // type, clientId
    await player.share(typeToShare, shareToAlicia)
    console.log(`${typeToShare} shared with ${shareToAlicia}`)

    await player.share(typeToShare, shareToClarence)
    console.log(`${typeToShare} shared with ${shareToClarence}`)
  } catch(e) {
    console.error(e)
  }
}

Judge(Clarence)
