Datamodel
=========

MongoDB
---------
The database consists of several collections.

* `userdb`, containing the users for poll.js.
* `polldb`, containing the polls for poll.js.


Polls
---------

A core design decision: How do we store the resulting answers? We could store them in a separate set of objects, mirroring our `Poll` object; i.e., for each `Poll` object, there exists a `Poll_Answer` object, mirrored all the way down. This makes cloning polls very easy, since none of the resulting data is stored in the `Poll` object, but seems cluttered.

I'm considering tacking the resulting answers onto `Response` objects. This will make cloning `Poll` objects more work, but will hopefully lead to a more easily conceptualized look-up process. If you have a poll id and want to know how many people answered question #3, you would: database.findpollbyid(id).question_list[2].sumRespondersHelperFunction(). This model will put a large number of helper functions in the `Question` object so that it can give useful information about its `Response` objects.

* `Poll` object
	* `name` string for description
	* `opening_slide` question object of type `not_a_question`, guaranteed to be first
	* `closing_slide` question object of type `not_a_question`, guaranteed to be last
	* `id` number for lookup
	* `open` boolean; open or closed, presently?
	* `owner` number; user id of poll creator
	* `theme` string describing optional themes
	* `widgets` list of widget objects to render
	* `expiry` date; when does the poll close?
	* `auto_renew` boolean; does this poll generate a new, identical (but for id) one when it expires?
	* `time_to_live` number; when auto-renewed, how long does this poll last?
	* `allow_skipping` boolean; can every question be skipped?
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
	* `next` the `id` label to jump to when this question is answered; overwritten by `response.next`

* `Response` object describing a single possible response to a single question
	* `Body` object containing some text, image, sound, video, etc.
	* `answers` object
		* value; the response, varies by question type
		* explanation; any explanation field
		* user; identification for the user that answered the question
		* timestamp; when the user answered the question
		* skipped; bool
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
	* `type` object
		* `login` object
			* `username` string
			* `passhash` string
		* `anonymous` string
	* `rights` object
		* `accessClosed` boolean
		* `create` boolean
		* `delete` boolean
		* `clone` boolean
		* `answer` boolean
		* `openClose` boolean
		* `getAnswers` boolean