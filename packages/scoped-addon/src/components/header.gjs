<template>
  <style>
    .alert{
      border: 1px solid black;
    }
    div {
      color: red;
    }
    p{
      font-style: italic;
      text-decoration: underline;
    }
  </style>
  <div class='alert'>
    <div>
      {{@title}}
    </div>
    <p>
      {{@message}}
    </p>
  </div>
</template>
