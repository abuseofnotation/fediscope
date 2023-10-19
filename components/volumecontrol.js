import {div, button, span} from '../helpers.js'
export const VolumeControl = ({volume = 0, setVolume}) => 
  span({className:"volumeControl"}, [
    button({text: "-", onClick: () => volume != 1 && setVolume(volume - 1)}),
    span({className: "currentVolume", text: volume}),
    button({text: "+", onClick: () => setVolume(volume +1)}),
  ])  
