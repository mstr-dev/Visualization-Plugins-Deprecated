// Data source: [Robert J. MacG. Dawson](http://www.amstat.org/publications/jse/v3n3/datasets.dawson.html)
var titanicData = {
  "nodes": [
    {
      "disp": "Third Class",
      "name": "third class"
    },
    {
      "disp": "Survived",
      "name": "survived"
    },
    {
      "disp": "Second Class",
      "name": "second class"
    },
    {
      "disp": "Crew",
      "name": "crew"
    },
    {
      "disp": "Perished",
      "name": "perished"
    },
    {
      "disp": "Adult",
      "name": "adult"
    },
    {
      "disp": "Female",
      "name": "female"
    },
    {
      "disp": "Child",
      "name": "child"
    },
    {
      "disp": "Male",
      "name": "male"
    },
    {
      "disp": "First Class",
      "name": "first class"
    }
  ],
  "flows": [
    {
      "thru": [
        "perished",
        "male",
        "adult",
        "first class"
      ],
      "value": 118
    },
    {
      "thru": [
        "perished",
        "female",
        "adult",
        "third class"
      ],
      "value": 89
    },
    {
      "thru": [
        "survived",
        "male",
        "child",
        "second class"
      ],
      "value": 11
    },
    {
      "thru": [
        "survived",
        "female",
        "child",
        "third class"
      ],
      "value": 14
    },
    {
      "thru": [
        "perished",
        "female",
        "child",
        "third class"
      ],
      "value": 17
    },
    {
      "thru": [
        "survived",
        "female",
        "child",
        "first class"
      ],
      "value": 1
    },
    {
      "thru": [
        "perished",
        "female",
        "adult",
        "second class"
      ],
      "value": 13
    },
    {
      "thru": [
        "survived",
        "female",
        "adult",
        "first class"
      ],
      "value": 140
    },
    {
      "thru": [
        "survived",
        "male",
        "adult",
        "crew"
      ],
      "value": 192
    },
    {
      "thru": [
        "perished",
        "male",
        "adult",
        "crew"
      ],
      "value": 670
    },
    {
      "thru": [
        "survived",
        "female",
        "child",
        "second class"
      ],
      "value": 13
    },
    {
      "thru": [
        "perished",
        "female",
        "adult",
        "crew"
      ],
      "value": 3
    },
    {
      "thru": [
        "perished",
        "male",
        "adult",
        "third class"
      ],
      "value": 387
    },
    {
      "thru": [
        "survived",
        "female",
        "adult",
        "crew"
      ],
      "value": 20
    },
    {
      "thru": [
        "perished",
        "female",
        "adult",
        "first class"
      ],
      "value": 4
    },
    {
      "thru": [
        "survived",
        "female",
        "adult",
        "third class"
      ],
      "value": 76
    },
    {
      "thru": [
        "perished",
        "male",
        "child",
        "third class"
      ],
      "value": 35
    },
    {
      "thru": [
        "survived",
        "male",
        "child",
        "first class"
      ],
      "value": 5
    },
    {
      "thru": [
        "perished",
        "male",
        "adult",
        "second class"
      ],
      "value": 154
    },
    {
      "thru": [
        "survived",
        "male",
        "child",
        "third class"
      ],
      "value": 13
    },
    {
      "thru": [
        "survived",
        "male",
        "adult",
        "first class"
      ],
      "value": 57
    },
    {
      "thru": [
        "survived",
        "female",
        "adult",
        "second class"
      ],
      "value": 80
    },
    {
      "thru": [
        "survived",
        "male",
        "adult",
        "third class"
      ],
      "value": 75
    },
    {
      "thru": [
        "survived",
        "male",
        "adult",
        "second class"
      ],
      "value": 14
    }
  ]
}
