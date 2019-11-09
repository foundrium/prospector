let Point = class {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

let SeamCarvingBackPointer = class {
  constructor(energy, pointer, current) {
    this.energy = energy;
    this.current = current;
    this.xPointer = pointer;
  }
}

let SeamCarving = class {
  constructor(arr) {
    this.energies = arr;
  }

  findMinimumBackpointer(data) {
    let current = data[0];
    for (let i = 1; i < data.length; i++) {
      if (data[i].energy < current.energy) {
        current = data[i];
      }
    }
    return current;
  }

  getMinimumSeam(seams) {
    let backTrace = [];
    let bottomRow = seams[seams.length - 1];
    let node = this.findMinimumBackpointer(bottomRow);
    backTrace.push(new Point(node.current, seams.length - 1));
    for (let y = seams.length - 2; y >= 0; y--){
      node = seams[y][node.xPointer];
      backTrace.push(new Point(node.current, y));
    }
    return backTrace.reverse();
  }

  computeMinimumSeam() {
    let seamEnergies = [];
    let previousSeam = [];
    for(let i = 0; i < this.energies[0].length; i++) {
      previousSeam.push(new SeamCarvingBackPointer(this.energies[0][i], null, i));
    }
    seamEnergies.push(previousSeam);

    for (let i = 1; i < this.energies.length; i++) {
      let energiesRow = this.energies[i];

      let seamEnergiesRow = [];
      for (let j = 0; j < energiesRow.length; j++) {
        const left = Math.max(j - 1, 0);
        const right = Math.min(j + 1, energiesRow.length - 1);
        const minParent = this.findMinimumBackpointer(seamEnergies[i-1].slice(left, right + 1));
        const minSeamEnergy = new SeamCarvingBackPointer(energiesRow[j] + seamEnergies[i-1][minParent.current].energy, 
                                                          minParent.current, j);
        seamEnergiesRow.push(minSeamEnergy);
      }

      seamEnergies.push(seamEnergiesRow);
    }

    return this.getMinimumSeam(seamEnergies);
  }

  computeMinimumSeamEnergy() {
    let previousSeam = this.energies[0];
    for (let i = 1; i < this.energies.length; i++) {
      let energiesRow = this.energies[i];

      let seamEnergiesRow = [];
      for (let j = 0; j < energiesRow.length; j++) {
        const left = Math.max(j - 1, 0);
        const right = Math.min(j + 1, energiesRow.length - 1);
        const minSeamEnergy = energiesRow[j] + Math.min(...previousSeam.slice(left, right + 1));
        seamEnergiesRow.push(minSeamEnergy);
      }

      previousSeam = seamEnergiesRow;
    }

    return Math.min(...previousSeam);
  }
};

const arr = [
  [9, 9, 0, 9, 9],
  [9, 9, 9, 8, 9],
  [9, 9, 9, 9, 0],
  [9, 9, 9, 0, 9]
];

const seamCarving = new SeamCarving(arr);
console.log(seamCarving.computeMinimumSeam());

