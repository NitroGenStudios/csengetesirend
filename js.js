function refresh()
{
	let today = new Date()
	
	let timer = document.getElementById("time")
	let current_time = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`
	timer.textContent = current_time

	let lesson_type = document.querySelector('input[name="choice"]:checked').value

	let lesson = find_lesson(lesson_type, get_time_from_string(current_time))
	let text = document.getElementById("desc_text")

	console.log(lesson);

	if (is_time_after(get_time_from_string(get_end_of_day(lesson_type)), get_time_from_string(current_time)))
	{
		text.innerHTML = "Vége a napnak!"
	}
	else if (lesson["is_szunet"] == true)
	{
		text.innerHTML = `Szünet van. <label class="text-purple-500 text-[24px]">${lesson["id"]}.</label> óra következik: <label class="text-purple-500 text-[24px]">${lesson["from"]}</label>-tól.`
	}
	else
	{
		text.innerHTML = `Óra van. Szünet lesz <label class="text-purple-500 text-[24px]">${time_distance(get_time_from_string(current_time), get_time_from_string(lesson.to))}</label> perc múlva.`
	}
}

function find_lesson(selected_type, current_time)
{
	let timetable = bellShedules[selected_type]
	let closest_lesson = timetable[0]
	let closest_distance = 9999

	timetable.forEach(lesson => {
		
		let from = get_time_from_string(lesson["from"])
		let to = get_time_from_string(lesson["to"])

		let smallest_distance = time_distance(current_time, from)

		if (is_time_between(current_time, from, to))
		{
			closest_distance = 0
			closest_lesson = lesson
		}
		else if (smallest_distance < closest_distance)
		{
			closest_distance = smallest_distance
			closest_lesson = lesson
		}
	});

	console.log(closest_lesson);
	console.log(closest_distance);

	return {id: closest_lesson["id"], from: closest_lesson["from"], to: closest_lesson["to"], is_szunet: closest_distance != 0}
}

function get_end_of_day(selected_type)
{
	return bellShedules[selected_type][bellShedules[selected_type].length - 1]["to"]
}

function get_time_from_string(str)
{
	let split = str.split(":")
	return [parseInt(split[0]), parseInt(split[1])]
}

function is_time_between(time, from, to)
{
	return to_minutes(from) < to_minutes(time) && to_minutes(to) > to_minutes(time)
}

function time_distance(t1, t2)
{
	return Math.abs(to_minutes(t1) - to_minutes(t2))
}

function is_time_after(t1, t2)
{
	return to_minutes(t1) - to_minutes(t2) <= 0
}

function to_minutes(t)
{
	return t[0] * 60 + t[1]
}

document.getElementById("c1").checked = true
refresh()