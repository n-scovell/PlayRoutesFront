<template>
    <div class="playBuild">
        <h2>{{ myData.title }}</h2>
        <hr />
        <div class="addPlayerBox" v-if="showAddPlayer">
            <button class="close" @click="closeAddPlayer">X</button>
            <MakeForm title="addPlayerForm" :formList="addPlayerForm" v-model="myGrid" @action="handleButtonActions" />
            <p>{{ addError }}</p>
        </div>
        <div class="grid" v-for="(g,index) in myPlayGrid" :key="'grid_'+index">
            <div class="player" :class="'P_'+p.position + ' ' + 'Y_'+p.standY.replace(' ', '') + ' ' + 'X_'+p.standX + ' ' + 'R_'+p.route" v-for="(p,index) in g.players" :key="'player_'+index">{{ p.position }}</div>
            <button class="addPlayer" @click="addToGrid(index)">+{{ index+1 }}</button>
        </div>
    </div>
</template>