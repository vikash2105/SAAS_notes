
import data from '../data.json';

let memory = JSON.parse(JSON.stringify(data));

export function loadData() {
  return memory;
}

export function saveData(updated) {
  // In serverless, persistence isn’t guaranteed between invocations,
  // but we keep it in-memory so requests within the same lambda reuse it.
  memory = updated;
}
