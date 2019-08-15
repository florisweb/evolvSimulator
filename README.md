# evolvSimulator
An evolution simulator






CREATUR

	DNA = {
		size: 1,
		speed: 1,
		eyeRange: 100,
			eyeCount
			eyeAngle - distance between all eyes (Radians)

		r: 0, 		\
		g: 100,	 	creatur colour
		b: 255,		/

		brain: [
			0 - layers
			2 - layer 0 length
			3 - layer 1 length

			.32 - bias 1 layer 0 
			.32 - bias 2 layer 0 
			.32 - weight 1 layer 0
			enz ...
		]

	}


	Brain:
	Inputs:
	- Energy (Mapped between 0 and 1)
	- Eye A: distance untill closest thing on eyeline
	- Eye B: ''
	- ...

	Outputs: 
	- relativeRotation: 0,5 is none 0 is counterclockwise 1 is clockwise
	- forwardsSpeed		> 0.1
	- reproduce: 		> 0,5 creatur will be cloned with some mutations
	- bite: 			> 0.5 takes some energy dependent on the size, and will take a part of a nearby creature's energy






