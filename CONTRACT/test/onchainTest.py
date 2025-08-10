def decode_hex_data(hex_string):
    # Remove '0x' prefix if present
    if hex_string.startswith('0x'):
        hex_string = hex_string[2:]
    
    # Convert hex to bytes
    data = bytes.fromhex(hex_string)
    
    # Parse the data according to ABI encoding rules
    # First 4 bytes are function selector (skip for this case)
    # Next 32 bytes chunks contain the actual data
    
    def read_uint256(data, offset):
        return int.from_bytes(data[offset:offset+32], 'big')
    
    def read_address(data, offset):
        # Address is in the last 20 bytes of a 32-byte slot
        addr_bytes = data[offset+12:offset+32]
        return '0x' + addr_bytes.hex()
    
    def read_string(data, string_offset):
        # String length is stored in the first 32 bytes at the offset
        length = read_uint256(data, string_offset)
        # String data starts 32 bytes after the length
        string_data = data[string_offset+32:string_offset+32+length]
        return string_data.decode('utf-8')
    
    # Skip function selector (first 4 bytes)
    offset = 4
    
    # Read owner address (32 bytes)
    owner = read_address(data, offset)
    offset += 32
    
    # Skip string offset pointers (we'll read them later)
    # These are: name, instagram, twitter, telegram, title, description, image offsets
    name_offset_ptr = read_uint256(data, offset)
    offset += 32
    instagram_offset_ptr = read_uint256(data, offset)
    offset += 32
    twitter_offset_ptr = read_uint256(data, offset)
    offset += 32
    telegram_offset_ptr = read_uint256(data, offset)
    offset += 32
    title_offset_ptr = read_uint256(data, offset)
    offset += 32
    description_offset_ptr = read_uint256(data, offset)
    offset += 32
    
    # Read target (uint256)
    target = read_uint256(data, offset)
    offset += 32
    
    # Read deadline (uint256)
    deadline = read_uint256(data, offset)
    offset += 32
    
    # Read image offset pointer
    image_offset_ptr = read_uint256(data, offset)
    
    # Now read the actual strings using their offset pointers
    # Add 4 to account for function selector we skipped
    name = read_string(data, name_offset_ptr + 4)
    instagram = read_string(data, instagram_offset_ptr + 4)
    twitter = read_string(data, twitter_offset_ptr + 4)
    telegram = read_string(data, telegram_offset_ptr + 4)
    title = read_string(data, title_offset_ptr + 4)
    description = read_string(data, description_offset_ptr + 4)
    image = read_string(data, image_offset_ptr + 4)
    
    return {
        'owner': owner,
        'target': target,
        'deadline': deadline,
        'name': name,
        'instagram': instagram,
        'twitter': twitter,
        'telegram': telegram,
        'title': title,
        'description': description,
        'image': image
    }

# Your hex data
hex_data = "0xda52d95f0000000000000000000000008cc7babb9102df7d3b99760ea00889c08e79db3d000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000470de4df82000000000000000000000000000000000000000000000000000000000198f84618000000000000000000000000000000000000000000000000000000000000000380000000000000000000000000000000000000000000000000000000000000002c553246736447566b58313959624f6b3346366832624649417830334e307471656a666a6a62794642435a493d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c553246736447566b5831387a4b34344532395943713646323877634e4f366d39656f7947723630527572673d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c553246736447566b58312b50537144793050757977386e3457687257347643684952727542584a366769493d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c553246736447566b58313972613743693873356e493576544b7756314677654c614f6c3736314447376b6f3d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000144b6562616b6172616e20487574616e205269617500000000000000000000000000000000000000000000000000000000000000000000000000000000000000595465726a616469206b6562616b6172616e20687574616e20646920526961752c206d656e6768616269736b616e20342048656b74617220687574616e2064616e2070656d756b696d616e2077617267612074657264656b617400000000000000000000000000000000000000000000000000000000000000000000000000004d68747470733a2f2f63646e2e6d6564636f6d2e69642f64796e616d69632f636f6e74656e742f323031352f30372f32362f3431353538362f314272336b6c5a4a69332e6a70673f773d3130323400000000000000000000000000000000000000"

# Decode the data
result = decode_hex_data(hex_data)
print(f"deadline: {result['deadline']}")
print(f"description: {result['description']}")
print(f"image: {result['image']}")
print(f"instagram: {result['instagram']}")
print(f"name: {result['name']}")
print(f"target: {result['target']}")
print(f"telegram: {result['telegram']}")
print(f"title: {result['title']}")
print(f"twitter: {result['twitter']}")
print(f"owner: {result['owner']}")