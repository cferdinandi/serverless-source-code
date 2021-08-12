let wizard = 'Merlin';

// Update the wizard variable
function saveName (name) {
	wizard = name;
}

// This will ALWAYS return Merlin, even if saveName is run
function getName () {
	return name;
}