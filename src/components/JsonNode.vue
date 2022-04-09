<template>
  <span class="json-node">
    <template
      v-if="showKey && jsonKey != null"
    >
      <span class="json-key">  {{ JSON.stringify(jsonKey) }} </span>
      <span class="json-colon"> : </span>
    </template>

    <template v-if="isBaseValue">
      <span
        class="json-base-value"
        :class="{
          'json-bool':type === 'boolean',
          'json-null':type === 'null',
          'json-number':type === 'number',
          'json-string':type === 'string',
        }"
      >{{ JSON.stringify(jsonValue) }}
      </span>
    </template>

    <template
      v-else
    >
      <span
        v-if="isArray"
      >[</span>
      <span
        v-else
      >{</span>
      <span
        class="json-subnode"
        :class="{
          'json-subnode-close':showSubNode,
          'json-subnode-open':!showSubNode
        }"
        :data-array-length="`${jsonValueKeys.length} items`"
        @click="showSubNode = !showSubNode"
      />

      <span
        v-show="showSubNode"
        class="json-child-list"
      >
        <span
          v-for="(key,index) in jsonValueKeys"
          :key="key"
          class="json-child-item"
        >
          <JsonNode
            :json-key="key"
            :json-value="jsonValue[key]"
            :show-key="!isArray"
          />
          <span
            v-if="!(jsonValueKeys.length > 0 && index == jsonValueKeys.length - 1)"
            class="json-colon"
          > ,</span>
        </span>
      </span>
      <span
        v-show="!showSubNode"
      >...&nbsp;&nbsp;</span>
      <span v-if="isArray">]</span>
      <span v-else>}</span>
    </template>
  </span>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import getTypeOf, { JsonValueType } from '../utils/typeof';

class Props {
  jsonKey = prop({ type: [Object, String, Number], default: null });

  jsonValue = prop({ type: [Object, String, Number, Array, Date, Boolean], default: undefined });

  showKey = prop({ type: Boolean, default: true });
}

@Options({
  watch: {
    jsonValue() {
      this.updateKeysAndType();
    },
  },
})
export default class JsonNode extends Vue.with(Props) {
  type = JsonValueType.null;

  jsonValueKeys:string[] = [];

  showSubNode = true;

  mounted() {
    this.updateKeysAndType();
  }

  updateKeysAndType() {
    if (this.jsonValue !== undefined) {
      this.type = getTypeOf(this.jsonValue);
      this.jsonValueKeys = Object.keys(this.jsonValue);
    } else {
      this.type = JsonValueType.null;
      this.jsonValueKeys = [];
    }
  }

  get isArray():boolean {
    return this.type === JsonValueType.array;
  }

  get isObject():boolean {
    return this.type === JsonValueType.object;
  }

  get isBaseValue():boolean {
    return !(this.isArray || this.isObject);
  }
}
</script>

<style lang="scss" scoped>
.json-subnode {
  &::before {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    width: 20px;
    height: 20px;
    margin: 0 0 0 10px;
    border-radius: 5px;
    background-color: #ebebeb;
    box-shadow: rgba(0, 0, 0, 0.231) 2px 2px 3px ;
    cursor: pointer;
  }
  &::after {
    display: inline-flex;
    content: attr(data-array-length);
    justify-content: center;
    align-items: center;
    height: 20px;
    color: rgb(195, 195, 195);
    font-size: 0.8rem;
    margin: 0 5px;
  }
}
.json-subnode-open{
  &::before {
    content: "+";
  }
}
.json-subnode-close{
  &::before {
    content: "-";
  }
}
.json-child-list {
  display: block;
  padding-left: 2em;
  border-left: 1px dotted rgba(0, 0, 0, 0.158);
  .json-child-item {
    display: block;
  }
}

.json-key {
  color: purple;
}
.json-colon {
}
.json-node {
  font-weight: bold;
}
.json-string {
  color: #0DBC79;
}
.json-number {
  color: #29B8DB;
}

.json-null {
  color: #D19A66;
}
.json-bool {
  color: #C678DD;
}
.json-base-value {
  position: relative;
}

</style>
