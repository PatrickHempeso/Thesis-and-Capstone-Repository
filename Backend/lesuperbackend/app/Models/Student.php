<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Student extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'student'; // <-- add this line

    protected $primaryKey = 'StudentID';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'StudentID', 'FirstName', 'LastName', 'Email', 'LoginDetails', 'Program', 'ProgramType', 'DateCreated'
    ];
}
