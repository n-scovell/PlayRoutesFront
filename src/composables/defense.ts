import { ref, onMounted } from 'vue'

export interface PosTypeDef {
  id: number
  pos: string
  x: number
  y: number
  name: string
}

export interface FormationDef {
  formName: string
  id: string
  players: PosTypeDef[]
}

export function useDefense() {
  const onTheLine = .58
  const threeMan = .55
  const cbA = 0.798
  const cbB = 0.201
  const cbC = 0.29
  const cbD = 0.70
  const formations = ref<FormationDef[]>([
    {
      formName: '3-4',
      id:'threefour',
      players: [
        { id: 0, pos: 'c', x: 0.5, y: onTheLine, name: 'tackle' },
        { id: 1, pos: 'g', x: 0.559, y: onTheLine, name: 'guard' },
        { id: 3, pos: 'g', x: 0.441, y: onTheLine, name: 'guard' },

        { id: 4, pos: 'lb', x: 0.41, y: 0.51, name: 'tackle' },
        { id: 5, pos: 'lb', x: 0.47, y: 0.48, name: 'tackle' },
        { id: 6, pos: 'lb', x: 0.53, y: 0.48, name: 'tackle' },
        { id: 7, pos: 'lb', x: 0.585, y: 0.51, name: 'tackle' },

        { id: 7, pos: 'cb', x: cbA, y: threeMan, name: 'tackle' },
        { id: 8, pos: 'cb', x: cbB, y: threeMan, name: 'tackle' },

        { id: 10, pos: 's', x: 0.435, y: .25, name: 'tackle' },
        { id: 11, pos: 's', x: 0.56, y: .25, name: 'tackle' },
      ],
    },
    {
      formName: '4-3',
      id:'fourthree',
      players: [
        { id: 0, pos: 'g', x: 0.559, y: onTheLine, name: 'guard' },
        { id: 1, pos: 't', x: 0.62, y: onTheLine, name: 'tackle' },
        { id: 2, pos: 'g', x: 0.441, y: onTheLine, name: 'guard' },
        { id: 3, pos: 't', x: 0.379, y: onTheLine, name: 'tackle' },
        { id: 4, pos: 'lb', x: 0.411, y: 0.48, name: 'tackle' },
        { id: 4, pos: 'lb', x: 0.5, y: 0.48, name: 'tackle' },
        { id: 6, pos: 'lb', x: 0.59, y: 0.48, name: 'tackle' },

        { id: 7, pos: 'cb', x: cbA, y: threeMan, name: 'tackle' },
        { id: 8, pos: 'cb', x: cbB, y: threeMan, name: 'tackle' },

        { id: 9, pos: 's', x: 0.59, y: .25, name: 'tackle' },
        { id: 10, pos: 's', x: 0.411, y: .25, name: 'tackle' },
      ],
    },
    {
      formName: '5-2',
      id:'fivetwo',
      players: [
        //LINE
        { id: 0, pos: 'c', x: 0.5, y: onTheLine, name: 'guard' },
        { id: 0, pos: 'g', x: 0.559, y: onTheLine, name: 'guard' },
        { id: 1, pos: 't', x: 0.62, y: onTheLine, name: 'tackle' },
        { id: 2, pos: 'g', x: 0.441, y: onTheLine, name: 'guard' },
        { id: 3, pos: 't', x: 0.379, y: onTheLine, name: 'tackle' },

        //LB
        { id: 4, pos: 'lb', x: 0.411, y: 0.48, name: 'tackle' },
        { id: 6, pos: 'lb', x: 0.59, y: 0.48, name: 'tackle' },

        //DB
        { id: 7, pos: 'cb', x: cbA, y: threeMan, name: 'tackle' },
        { id: 8, pos: 'cb', x: cbB, y: threeMan, name: 'tackle' },
        { id: 10, pos: 's', x: 0.435, y: .25, name: 'tackle' },
        { id: 11, pos: 's', x: 0.56, y: .25, name: 'tackle' },
      ],
    },
    {
      formName: 'Nickel',
      id:'nickel',
      players: [
        { id: 0, pos: 'g', x: 0.559, y: onTheLine, name: 'guard' },
        { id: 1, pos: 't', x: 0.62, y: onTheLine, name: 'tackle' },
        { id: 2, pos: 'g', x: 0.441, y: onTheLine, name: 'guard' },
        { id: 3, pos: 't', x: 0.379, y: onTheLine, name: 'tackle' },
        
        { id: 4, pos: 'lb', x: 0.411, y: 0.48, name: 'tackle' },
        { id: 6, pos: 'lb', x: 0.59, y: 0.48, name: 'tackle' },

        { id: 7, pos: 'cb', x: cbA, y: threeMan, name: 'tackle' },
         { id: 7, pos: 'cb', x: cbC, y: threeMan, name: 'tackle' },
        { id: 8, pos: 'cb', x: cbB, y: threeMan, name: 'tackle' },

        { id: 10, pos: 's', x: 0.435, y: .25, name: 'tackle' },
        { id: 11, pos: 's', x: 0.56, y: .25, name: 'tackle' },
      ],
    },
    {
      formName: 'Dime',
      id:'Dime',
      players: [
        { id: 0, pos: 'g', x: 0.559, y: onTheLine, name: 'guard' },
        { id: 1, pos: 't', x: 0.62, y: onTheLine, name: 'tackle' },
        { id: 2, pos: 'g', x: 0.441, y: onTheLine, name: 'guard' },
        { id: 3, pos: 't', x: 0.379, y: onTheLine, name: 'tackle' },
        { id: 4, pos: 'lb', x: 0.5, y: 0.48, name: 'tackle' },
        { id: 7, pos: 'cb', x: cbA, y: threeMan, name: 'tackle' },
        { id: 7, pos: 'cb', x: cbC, y: .45, name: 'tackle' },
        { id: 8, pos: 'cb', x: cbB, y: threeMan, name: 'tackle' },
        { id: 7, pos: 'cb', x: cbD, y: .45, name: 'tackle' },
        { id: 10, pos: 's', x: 0.435, y: .25, name: 'tackle' },
        { id: 11, pos: 's', x: 0.56, y: .25, name: 'tackle' },
      ],
    },
    {
      formName: 'Goaline',
      id:'goaline',
      players: [
        { id: 0, pos: 'c', x: 0.5, y: onTheLine, name: 'guard' },
        { id: 0, pos: 't', x: 0.559, y: onTheLine, name: 'guard' },
        { id: 1, pos: 'de', x: 0.62, y: onTheLine, name: 'tackle' },
        { id: 2, pos: 't', x: 0.441, y: onTheLine, name: 'guard' },
        { id: 3, pos: 'de', x: 0.379, y: onTheLine, name: 'tackle' },

        { id: 4, pos: 'cb', x: 0.323, y: onTheLine, name: 'tackle' },
        { id: 7, pos: 'cb', x: .678, y: onTheLine, name: 'tackle' },

        { id: 4, pos: 'lb', x: 0.411, y: 0.48, name: 'tackle' },
        { id: 4, pos: 'lb', x: 0.5, y: 0.48, name: 'tackle' },
        { id: 6, pos: 'lb', x: 0.59, y: 0.48, name: 'tackle' },

        { id: 11, pos: 's', x: 0.5, y: .35, name: 'tackle' },
        // { id: 7, pos: 'cb', x: cbC, y: onTheLine, name: 'tackle' },
        // { id: 8, pos: 'cb', x: cbB, y: threeMan, name: 'tackle' },
        // { id: 7, pos: 'cb', x: cbD, y: onTheLine, name: 'tackle' },
        // { id: 10, pos: 's', x: 0.435, y: onTheLine, name: 'tackle' },
        // { id: 11, pos: 's', x: 0.56, y: onTheLine, name: 'tackle' },
      ],
    },
    
  ])
  
  
  return {
    formations,
  }
}