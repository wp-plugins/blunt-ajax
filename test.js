
  var arguments = {parameters:{action:'test_blunt_ajax',
                               my_parameter:'Some Value"',
                               nonce:'12345678',
                               multidimensional:{name1:'value1',
                                                 name2:'value2',
                                                 name3:['array value 1', 
                                                        'array value 2', 
                                                        [1,2,4]]}},
                   method:'POST',
                   debug:true,
                   encoding:'uri'
                  };
  bluntAjax(arguments);