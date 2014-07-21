Datamodel
=========

MongoDB
---------
The database consists of several collections.

* `userlist`, from a prior tutorial. This should be removed soon.
* `userdb`, containing the users for poll.js.
* `polldb`, containing the polls for poll.js.


Polls
---------

A core design decision: How do we store the resulting answers? We could store them in a separate set of objects, mirroring our `Poll` object; i.e., for each `Poll` object, there exists a `Poll_Answer` object, mirrored all the way down. This makes cloning polls very easy, since none of the resulting data is stored in the `Poll` object, but seems cluttered.

I'm considering tacking the resulting answers onto `Response` objects. This will make cloning `Poll` objects more work, but will hopefully lead to a more easily conceptualized look-up process. If you have a poll id and want to know how many people answered question #3, you would: database.findpollbyid(id).question_list[2].sumRespondersHelperFunction(). This model will put a large number of helper functions in the `Question` object so that it can give useful information about its `Response` objects.

* `Poll` object
	* `name` string for description
	* `opening_slide` question object of type `not_a_question`, guaranteed to be first
	* `closing_slide` queston object of type `not_a_question`, guaranteed to be last
	* `id` number for lookup
	* `open` boolean; open or closed, presently?
	* `owner` number; user id of poll creator
	* `theme` string describing optional themes
	* `widgets` list of widget objects to render
	* `expiry` date; when does the poll close?
	* `auto_renew` boolean; does this poll generate a new, identical (but for id) one when it expires?
	* `time_to_live` number; when auto-renewed, how long does this poll last?
	* `question_list` list of question objects; defaults to question_list[0] as the first question

* `Question` object describing a single question
	* `Body` object containing some text, image, sound, video, etc
	* `Type` object describing how the user responds to a question and how the page is rendered
		* `pick_n` user responds by picking up to `n` items
			* `name` string; `pick_n`
			* `n` number; rendering changes when n = 1 from check box to radio button
			* `allow_zero` boolean; can user pick 0 items?
			* `require_n` boolean; must user pick `n` items?
			* `response_list` list of response objects
		* `slider` user responds by choosing a position along a slider
			* `name` string; `slider`
			* `min` number; inclusive
			* `max` number; inclusive
			* `step` number
			* `response` a single `Response` object
			* `up_and_up` boolean; render `max` as `max +`
			* `down_and_down` boolean; render `min` as `min -`
			* `more_and_more` boolean; render `max` as `> max`
			* `less_and_less` boolean; render `min` as `< min`
		* `not_a_question` user gets a prompt and a next button, but no response
		* `screen_location` user responds by tapping somewhere inside the app
		* `image`
		* `video`
		* `sound`
	* `id` number for look-up
	* `demographics_name` string specifying what this question describes (age, gender); used to set User.demographcs(`demographics_name`) = `response_chosen.body()`. In short, questions with `demographics_name` set to non-null will edit Users' demographics fields. 
	* `next` number of next question's `id`; allows branching; defaults to `this.id` + 1

* `Response` object describing a single possible response to a single question
	* `Body` object containing some text, image, sound, video, etc.
	* `answers` list of tuples in the form (User, answer_chosen, additional_data)
	* `always_explainable` boolean; always has a text field beneath it
	* `situationally_explainable` boolean; renders a text field beneath it when chosen
	* `must_explain` boolean; whether or not the rendered text field must have some contents
	* `metadata` list of tag objects
	* `change_next_to` number; changes parent `Question`'s next field to allow branching.

* `Tag` object describing some word and intensity associated with a response
	* `tag` string
	* `intensity` number

Users
------
* `User` object
	* `privileges` string
		* "transient", non-password-protected nickname, can answer polls
		* "resident", password-protected nickname, can answer polls
		* "superuser", can answer and create polls and view results of polls they created
		* "admin", can create polls and view results of any poll
	* `polls_created` list of poll id's
	* `polls_answered` list of poll id's
	* `demographics` dictionary of demographic information known; used to prune demographics questions if they're known; "transient" users get demographics questions every time; EASILY CLOBBERED BY POORLY WRITTEN POLLS! BE CAREFUL!